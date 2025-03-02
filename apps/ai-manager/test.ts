const username: string = 'admin';
const password: string = 'teehee';
const bearerToken: string =
  '742aa79173ef4c8fb192cd7532e767a199d7034a6bc84a1dab6362f7fd0b38ed';

async function fetchData(): Promise<void> {
  try {
    const headers: Headers = new Headers();
    headers.set('Authorization', `Bearer ${bearerToken}`);
    headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
    headers.set('Content-Type', 'application/json');

    const response: Response = await fetch(
      'https://repnet-api.bunnys.cloud/v1/infer',
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          id: '123',
          model_id:
            'f886220c83f69e67456d45bc36875f065cf93f54aad60b9e60c6700409f64f3a',
          prompt: 'A cute little house',
          negative_prompt: 'blurry, low quality',
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 512,
          height: 512,
          num_images: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();
