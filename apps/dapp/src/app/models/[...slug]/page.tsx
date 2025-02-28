'use client';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DynamicImage } from '@/components/DynamicImage';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const callAPI = async () => {
    setLoading(true);
    const res = await fetch('/api/inferPublic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await res.json();

    console.log(data);
    setImages(data.data.images);
    setLoading(false);
  };

  return (
    <div className="w-full h-full pb-12 flex flex-col justify-between">
      <div>
        <div className="flex w-full items-center justify-between">
          <div className="max-w-[500px]">
            <div className="text-lg font-semibold">Crypto Logo Generator</div>
            <div className="text-md mt-2 text-gray-600">
              Aj will generate a hella nice crypto logo for u mate.
            </div>
          </div>
          <Link href={'/bounties/bounty-form'}>
            <Button variant="cta-solid">Bounty Details &gt;</Button>
          </Link>
        </div>
        <div className="w-full h-[1px] mt-6  bg-gray-300" />
      </div>

      <div className="mt-12 flex justify-center">
        {loading ? (
          <Skeleton className="w-[512px] h-[512px] rounded-lg" />
        ) : (
          <>
            {images.length > 0 && (
              <DynamicImage
                alt="generated image"
                height={images[0].height}
                width={images[0].width}
                src={images[0].url}
                // height={256}
                // width={256}
                // src={
                //   'https://vucmbzcjyxbxaapykklr.supabase.co/storage/v1/object/public/generated-images/b9b4357c-ca23-4383-9397-c6c98f12dce3'
                // }
              />
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-between rounded-full bg-white border-2 border-sidebar-border pr-2 pl-2">
        <input
          className="grow outline-none border-0 field-sizing-fixed h-[50px]"
          placeholder="What can I generate for you?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          size="sm"
          className="rounded-full bg-gray-200 border-0 hover:bg-gray-100"
          icon
          onClick={callAPI}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
