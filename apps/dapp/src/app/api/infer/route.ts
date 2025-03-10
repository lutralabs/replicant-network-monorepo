import { randomUUID } from 'node:crypto';
import { config } from '@/wagmi';
import { verifyMessage } from '@wagmi/core';
import type { NextRequest } from 'next/server';
import { createPublicClient, http } from 'viem';
import { repNetManagerAbi } from '@/generated/RepNetManager';
import { supabaseServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

// Initialize Viem client for contract interactions
const publicClient = createPublicClient({
  chain: config.chains[0],
  transport: http(),
});

// Enum for crowdfunding phases (as per the contract)
enum CrowdfundingPhase {
  FUNDING_PHASE = 0,
  SUBMISSION_PHASE = 1,
  VOTING_PHASE = 2,
  FINALIZED = 3,
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  if (!requestBody.prompt) {
    return Response.json(
      { message: 'Please enter a prompt to generate images' },
      { status: 400 }
    );
  }

  const supabase = supabaseServiceRoleClient();

  // 1. SIWE + PROMPT + CROWDFUND ID
  const prompt = requestBody.prompt;
  const signedMessage = requestBody.signedMessage;
  const address = requestBody.address;
  const bountyId = requestBody.bountyId;
  const models = requestBody.models;

  console.log(prompt, signedMessage, address, bountyId, models);

  // 2. Contract call -> isVotingPhase
  try {
    const phase = await publicClient.readContract({
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
      abi: repNetManagerAbi,
      functionName: 'crowdfundingPhase',
      args: [BigInt(bountyId)],
    });

    if (phase !== CrowdfundingPhase.VOTING_PHASE) {
      return Response.json(
        {
          message:
            'This bounty is not currently in the voting phase. You can only test models during the voting phase.',
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error checking bounty phase:', error);
    return Response.json(
      {
        message:
          'There was a problem checking the bounty phase. Please try again later.',
      },
      { status: 500 }
    );
  }

  console.log('valid phase');

  // 3. Verify SIWE -> Get verified Address?
  const isValidSignature = await verifyMessage(config, {
    address,
    message: prompt,
    signature: signedMessage,
  });

  if (!isValidSignature) {
    return Response.json(
      {
        message:
          'The message signature is invalid. Please try signing the prompt again.',
      },
      { status: 401 }
    );
  }
  console.log('valid signature');
  // 4. Contract call (Address, crowdfund ID) -> canTest
  try {
    // Using hasDeposited function to directly check if the address has funded this bounty
    const hasDeposited = await publicClient.readContract({
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
      abi: repNetManagerAbi,
      functionName: 'hasDeposited',
      args: [BigInt(bountyId), address as `0x${string}`],
    });

    if (!hasDeposited) {
      return Response.json(
        {
          message:
            'Only funders can test models. You need to fund this bounty before you can test the submitted models.',
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error checking if user has deposited:', error);
    return Response.json(
      {
        message:
          'Failed to verify if you have funded this bounty. Please try again later.',
      },
      { status: 500 }
    );
  }

  console.log('valid tester');

  // 5. DB Call (Address, crowdfund ID) -> Has already tested?
  try {
    const { data: crowdfundData, error: crowdfundError } = await supabase
      .from('crowdfund')
      .select('testers')
      .eq('id', bountyId)
      .single();

    if (crowdfundError) {
      console.error('Error fetching crowdfund data:', crowdfundError);
      return Response.json(
        {
          message:
            'Failed to check your testing status for this bounty. Please try again later.',
        },
        { status: 500 }
      );
    }

    const hasAlreadyTested = crowdfundData?.testers?.includes(address);
    if (hasAlreadyTested) {
      return Response.json(
        {
          message:
            'You have already tested the models for this bounty. Only one test per address is allowed.',
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error checking if user already tested:', error);
    return Response.json(
      {
        message:
          'Failed to verify your testing history. Please try again later.',
      },
      { status: 500 }
    );
  }

  if (models.length === 0) {
    return Response.json(
      { message: 'There are no models available to test for this bounty.' },
      { status: 400 }
    );
  }

  // 6. Create requests for all models and wait for them to complete
  const promises = models.map(async (model) => {
    const body = {
      id: randomUUID(),
      model_id: model.hash.split('_')[1],
      prompt,
      negative_prompt: 'blurry, low quality',
      num_inference_steps: 15,
      guidance_scale: 7.5,
      width: 256,
      height: 256,
      num_images: 1,
    };

    // 7. Fetch
    const response = await fetch(`${process.env.API_ENDPOINT}/v1/infer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    return response.json();
  });

  // Wait for all fetch operations to complete
  let results;
  try {
    results = await Promise.all(promises);
  } catch (error) {
    console.error('Error generating images:', error);
    return Response.json(
      {
        message:
          'Failed to generate images. The AI service might be temporarily unavailable.',
      },
      { status: 500 }
    );
  }

  // 8. Update DB (Image + prompt + address generated Image)
  try {
    // First insert the prompt
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .insert({
        crowdfund_id: bountyId,
        prompt: prompt,
      })
      .select();

    if (promptError) {
      console.error('Error inserting prompt:', promptError);
      return Response.json(
        {
          message:
            'Failed to save your prompt to our database. Please try again later.',
        },
        { status: 500 }
      );
    }

    // Then insert the generated images
    const imagesToInsert = results.flatMap((result, index) => {
      return result.images
        ? result.images.map((image) => ({
            prompt_id: promptData[0].id,
            URL: image.url || result.output?.[0] || '',
            modelHash: models[index].hash,
            width: 256,
            height: 256,
          }))
        : [];
    });

    const { error: imageError } = await supabase
      .from('images')
      .insert(imagesToInsert);

    if (imageError) {
      console.error('Error inserting images:', imageError);
      return Response.json(
        {
          message:
            'The images were generated but could not be saved. Please try again later.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating database with images and prompts:', error);
    return new Response('Error saving data', { status: 500 });
  }

  // 9. Update DB (user has tested)
  try {
    const { data: crowdfundData, error: fetchError } = await supabase
      .from('crowdfund')
      .select('testers')
      .eq('id', bountyId)
      .single();

    if (fetchError) {
      console.error('Error fetching testers:', fetchError);
      return new Response('Error updating tester status', { status: 500 });
    }

    // Add the current user to testers array
    const updatedTesters = [...(crowdfundData?.testers || []), address];

    const { error: updateError } = await supabase
      .from('crowdfund')
      .update({ testers: updatedTesters })
      .eq('id', bountyId);

    if (updateError) {
      console.error('Error updating testers:', updateError);
      return new Response('Error updating tester status', { status: 500 });
    }
  } catch (error) {
    console.error('Error updating testers:', error);
    return new Response('Error updating tester status', { status: 500 });
  }

  return Response.json({ data: results });
}
