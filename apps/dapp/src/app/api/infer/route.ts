import type { NextRequest } from 'next/server';

// Gen SIWE

export async function POST(request: NextRequest) {
  // CROWDFUNDING EXAMPLE

  // 1. SIWE + PROMPT + CROWDFUND ID

  // 2. Contract call -> isVotingPhase

  // 3. Verify SIWE -> Get verified Address?

  // 4. Contract call (Address, crowdfund ID) -> canTest

  // 5. DB Call (Address, crowdfund ID) -> Has already tested?

  // 6. Create Request Body

  const body = {
    id: '1a660434-b14f-45fc-a237-8f7694adacb7', //gen new uuid
    model_id:
      'f886220c83f69e67456d45bc36875f065cf93f54aad60b9e60c6700409f64f3a', //Stored in contract
    prompt: 'A beautiful landscape with mountains and a lake',
    negative_prompt: 'blurry, low quality',
    num_inference_steps: 30,
    guidance_scale: 7.5,
    width: 512,
    height: 512,
    seed: 42,
    num_images: 1,
  };

  // 7. Fetch

  const res = await fetch('http://192.168.0.122:8000/v1/infer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + 'test-key-1',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  // 8. Update DB (Image + prompt + address generated Image)

  // 9. Return

  return Response.json({ data });
}
