import { randomUUID } from 'node:crypto';
import { supabaseServiceRoleClient } from '@/lib/supabase/serviceRoleClient';
import { config } from '@/wagmi';
import { verifyMessage } from '@wagmi/core';
import type { NextRequest } from 'next/server';

/**
 * Handle POST requests to submit a new model to the database
 */
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    // Validate required fields
    const requiredFields = [
      'owner_address',
      'model_url',
      'signature',
      'message',
      'bounty_id',
    ];
    for (const field of requiredFields) {
      if (!requestBody[field]) {
        return Response.json(
          { error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    const { owner_address, model_url, signature, message, bounty_id } =
      requestBody;

    // Step 1: Verify the signed message
    const isValidSignature = await verifyMessage(config, {
      address: owner_address,
      message,
      signature,
    });

    if (!isValidSignature) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Step 2: Verify that the URL in the message matches the submitted URL
    if (!message.includes(model_url)) {
      return Response.json(
        { error: 'Signature does not match the provided model URL' },
        { status: 401 }
      );
    }

    // Step 3: Verify that the bounty ID in the message matches the submitted ID
    const bountyIdPattern = /bounty ID: (\d+)/i;
    const bountyIdMatch = message.match(bountyIdPattern);

    if (!bountyIdMatch || bountyIdMatch[1] !== bounty_id.toString()) {
      return Response.json(
        { error: 'Signature does not match the provided bounty ID' },
        { status: 401 }
      );
    }

    const supabase = supabaseServiceRoleClient();

    // Step 4: Check if user already submitted a model for this bounty
    const { data: existingSubmission, error: queryError } = await supabase
      .from('submitted_models')
      .select('*')
      .eq('owner_address', owner_address)
      .eq('crowdfund_id', bounty_id)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error checking existing submission:', queryError);
      return Response.json(
        { error: 'Error checking existing submissions' },
        { status: 500 }
      );
    }

    if (existingSubmission) {
      return Response.json(
        { error: 'You have already submitted a model for this bounty' },
        { status: 409 }
      );
    }

    // Prepare model submission data
    const modelData = {
      hash: randomUUID(),
      owner_address,
      model_url,
      crowdfund_id: Number(bounty_id),
      accepted: false,
      submitted_at: new Date().toISOString(),
    };

    // Insert new model submission into the database
    const { data, error } = await supabase
      .from('submitted_models')
      .insert(modelData)
      .select()
      .single();

    if (error) {
      console.error('Error submitting model:', error);
      return Response.json(
        { error: 'Failed to submit model' },
        { status: 500 }
      );
    }

    // Return success response with the created data
    return Response.json({
      success: true,
      message: 'Model submitted successfully',
      data,
    });
  } catch (error) {
    console.error('Unexpected error during model submission:', error);
    return Response.json(
      {
        error: 'Internal server error while processing model submission',
      },
      { status: 500 }
    );
  }
}
