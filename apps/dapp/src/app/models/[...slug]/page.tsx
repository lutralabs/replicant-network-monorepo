'use client';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    <div className="w-full h-full pb-12 flex flex-col justify-between">
      <div>
        <div className="flex w-full items-center justify-between">
          <div className="max-w-[500px]">
            <div className="text-lg font-semibold">Model Bounties</div>
            <div className="text-md mt-2 text-gray-600">
              A list of existing bounties for custom AI models. Users are
              welcome to join existing bounties by either contributing MON to
              the bounty or by submitting a Model OR create a new bounty.
            </div>
          </div>
          <Link href={'/bounties/bounty-form'}>
            <Button variant="cta-solid">Bounty Details &gt;</Button>
          </Link>
        </div>
        <div className="w-full h-[1px] mt-6  bg-gray-300" />
      </div>

      <div className="mt-12">
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
      </div>
      <div className="flex justify-between rounded-full bg-white border-2 border-sidebar-border pr-4 pl-2">
        <input
          className="grow outline-none border-0 field-sizing-fixed h-[55px]"
          placeholder="What can I generate for you?"
        />
        <Button
          size="sm"
          className="rounded-full bg-gray-200 border-0 hover:bg-gray-100 my-2"
          icon
          onClick={callAPI}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
