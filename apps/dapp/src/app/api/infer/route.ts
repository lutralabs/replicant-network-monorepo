import type { NextRequest } from 'next/server';
import { verifyMessage } from '@wagmi/core';
import { config } from '@/wagmi';
import { randomUUID } from 'node:crypto';

// Gen SIWE

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  if (!requestBody.prompt) {
    return new Response('Prompt is required', { status: 400 });
  }

  // CROWDFUNDING EXAMPLE

  // 1. SIWE + PROMPT + CROWDFUND ID

  const prompt = requestBody.prompt;
  const signedMessage = requestBody.signedMessage;
  const address = requestBody.address;
  const bountyId = requestBody.bountyId;
  const models = requestBody.models;

  console.log(prompt, signedMessage, address, bountyId, models);

  // 2. Contract call -> isVotingPhase

  // 3. Verify SIWE -> Get verified Address?

  const res = await verifyMessage(config, {
    address,
    message: prompt,
    signature: signedMessage,
  });

  if (!res) {
    return new Response('Invalid signature', { status: 401 });
  }

  // 4. Contract call (Address, crowdfund ID) -> canTest

  // 5. DB Call (Address, crowdfund ID) -> Has already tested?

  if (models.length === 0) {
    return new Response('No models submitted', { status: 400 });
  }

  // 6. Create requests for all models and wait for them to complete
  const promises = models.map(async (model) => {
    const body = {
      id: randomUUID(),
      model_id: model.hash,
      prompt,
      negative_prompt: 'blurry, low quality',
      num_inference_steps: 30,
      guidance_scale: 7.5,
      width: 512,
      height: 512,
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
  const results = await Promise.all(promises);

  // const data = await res.json();

  // 8. Update DB (Image + prompt + address generated Image)

  // 9. Return

  return Response.json({ data: results });
}
