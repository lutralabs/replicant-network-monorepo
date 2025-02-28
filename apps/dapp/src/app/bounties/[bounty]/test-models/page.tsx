'use client';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DynamicImage } from '@/components/DynamicImage';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { usePathname } from 'next/navigation';
import { BOUNTIES } from '@/constants/bounties';

export default function Page() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const slug = pathNames[pathNames.length - 2];

  const bounty = BOUNTIES.find((bounty) => bounty.id === slug);

  if (bounty.status !== 'voting') {
    return <div>Not in voting phase</div>;
  }

  const personalSign = async () => {
    const address = wallet.address;
    const message = prompt;
    const provider = await wallet.getEthereumProvider();
    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    });
    console.log(signature);
    await callAPI(signature, address);
  };

  const callAPI = async (signedMessage: string, address: string) => {
    setLoading(true);
    const res = await fetch('/api/infer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        signedMessage,
        address,
        bountyId: '1',
        models: bounty.submittedModels,
      }),
    });

    const data = await res.json();

    console.log('dd', data);
    setImages(data.data);
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

      <div className="mt-12 flex justify-center flex-wrap gap-x-12 gap-y-12">
        {loading ? (
          <>
            {bounty.submittedModels.map((model, id) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Skeleton key={id} className="w-[512px] h-[512px] rounded-lg" />
            ))}
          </>
        ) : (
          <>
            {images.length > 0 &&
              images.map((image, modelId) => {
                console.log(image);
                if (image.images.length > 0) {
                  return (
                    <div
                      key={image.id}
                      className="flex flex-col items-center gap-y-2"
                    >
                      <DynamicImage
                        alt="generated image"
                        height={image.images[0].height}
                        width={image.images[0].width}
                        src={image.images[0].url}
                      />
                      <div>Model {modelId + 1}</div>
                    </div>
                  );
                }
                return <div key={image.id} className="hidden" />;
              })}
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
          onClick={personalSign}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
