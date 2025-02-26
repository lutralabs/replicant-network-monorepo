'use client';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function Page() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const callAPI = async () => {
    setLoading(true);
    const res = await fetch('/api/infer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    console.log(data);
    setImages(data.data.images);
    setLoading(false);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {loading ? (
        <div>Loading...</div>
      ) : (
        images.length > 0 && (
          <Image
            alt="generated image"
            height={images[0].height}
            src={`data:image/png;base64,${images[0].base64}`}
            width={images[0].width}
          />
        )
      )}
      <Button onClick={callAPI}>Call API</Button>
    </div>
  );
}
