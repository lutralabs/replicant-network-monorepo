import { randomUUID } from 'node:crypto';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  if (!requestBody.prompt) {
    return new Response('Prompt is required', { status: 400 });
  }
  const body = {
    id: randomUUID(),
    model_id:
      'f886220c83f69e67456d45bc36875f065cf93f54aad60b9e60c6700409f64f3a',
    prompt: requestBody.prompt,
    negative_prompt: 'blurry, low quality',
    num_inference_steps: 5,
    guidance_scale: 7.5,
    width: 256,
    height: 256,
    num_images: 1,
  };

  const res = await fetch('https://repnet-ai-manager.fly.dev/v1/infer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AI_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return Response.json({ data });
}
