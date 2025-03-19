import { randomUUID } from 'node:crypto';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  if (!requestBody.prompt) {
    return Response.json(
      { message: 'Please enter a prompt to generate images' },
      { status: 400 }
    );
  }

  const modelHash = requestBody.modelHash;

  if (!modelHash) {
    return Response.json(
      { message: 'Model hash is required' },
      { status: 400 }
    );
  }

  // Define our static images - select based on hash
  const staticImages = [
    'https://i.imgur.com/LObP9J9.png',
    'https://i.imgur.com/SoKZUZQ.png',
  ];

  // Use last character of hash to determine which image to use (pseudo-random but deterministic)
  const imageIndex = Number.parseInt(modelHash.slice(-1), 16) % 2;

  // Create fake result
  const result = {
    id: randomUUID(),
    images: [
      {
        url: staticImages[imageIndex],
        height: 256,
        width: 256,
      },
    ],
  };

  return Response.json({ data: result });
}
