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
    num_inference_steps: 30,
    guidance_scale: 7.5,
    width: 512,
    height: 512,
    num_images: 1,
  };

  const res = await fetch(`${process.env.API_ENDPOINT}/v1/infer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return Response.json({ data });
}
