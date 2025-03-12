'use client';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { DynamicImage } from '@/components/DynamicImage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { type BountyCard, useGetBounties } from '@/hooks/useGetBounties';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowUpRight, CornerRightUp } from 'lucide-react';
import Link from 'next/link';

const findWinningBounty = (bounties: BountyCard[], modelHash: string) => {
  if (!bounties) return undefined;

  const winningBounties = bounties.filter((bounty) => bounty.winner);

  const bounty = winningBounties.find((bounty) => {
    const res = bounty.submissions.some((submission) => {
      return submission.id.split('0x')[1] === modelHash;
    });
    if (res) return bounty;
  });

  return bounty;
};

export default function Page() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const params = useParams();

  const modelHash = params?.slug[0] || '';

  // Use the dedicated hook for fetching a single bounty if we have an ID
  const {
    bounties,
    isLoading: isBountyLoading,
    error: bountyError,
  } = useGetBounties();

  const modelBounty = useMemo(() => {
    if (isBountyLoading) return undefined;
    return findWinningBounty(bounties, modelHash);
  }, [bounties, isBountyLoading]);

  const callAPI = async () => {
    if (!prompt.trim() || !modelHash) return;

    setLoading(true);
    try {
      const res = await fetch('/api/inferPublic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          modelHash: modelHash.split('0x')[1],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await res.json();
      setImages(data.data.images || []);
    } catch (error) {
      console.error('Error generating image:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isBountyLoading) {
    return (
      <div className="w-full h-full pb-12 flex flex-col justify-between">
        <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
          <Skeleton className="h-8 w-[300px] mb-2" />
          <Skeleton className="h-6 w-[200px]" />
        </div>

        <div className="mt-12 flex justify-center">
          <Skeleton className="w-[512px] h-[512px] rounded-lg" />
        </div>

        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-[50px] w-full rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // Error state
  if (bountyError || !modelBounty) {
    return (
      <div className="w-full h-full pb-12">
        <div className="bg-white rounded-lg p-6 border border-red-200 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-red-600">
            Error Loading Model
          </h1>
          <p className="mt-2 text-gray-600">
            {bountyError
              ? 'We encountered an error while loading this model. Please try again later.'
              : 'Model not found or not yet finalized.'}
          </p>
          <Link href="/models" className="mt-4 inline-block">
            <Button variant="outline" className="mt-2">
              <ArrowRight className="mr-2 h-4 w-4" />
              Return to Models
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] pb-12 flex flex-col">
      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 lg:gap-0">
          <div className="max-w-full lg:max-w-[70%]">
            <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
              {modelBounty.title || 'Untitled Model'}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm lg:text-base max-md:line-clamp-3 md:line-clamp-4">
              {modelBounty.description || 'No description available'}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 w-full lg:w-auto">
            <Link
              href={`https://testnet.monadexplorer.com/token/${modelBounty.token}`}
              target="_blank"
              className="w-full lg:w-auto"
            >
              <Button variant="cta-solid" className="w-full lg:w-auto">
                Token
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href={`/bounties/${modelBounty.id}`}
              className="w-full lg:w-auto"
            >
              <Button variant="outline" className="w-full lg:w-auto">
                View Completed Bounty
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12 flex-grow flex flex-col items-center justify-center min-h-[300px] md:min-h-[512px] border-2 border-dashed border-gray-200 rounded-lg p-4">
        {loading ? (
          <Skeleton className="w-full max-w-[512px] h-[300px] md:h-[512px] rounded-lg" />
        ) : (
          <>
            {images.length > 0 ? (
              <DynamicImage
                alt="generated image"
                height={images[0].height}
                width={images[0].width}
                src={images[0].url}
              />
            ) : (
              <div className="text-gray-500 text-center flex flex-col items-center justify-center h-full">
                <p>Your generated image will appear here</p>
                <p className="text-sm mt-2">Try entering a prompt below</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-y-2 mt-auto pt-8">
        <div className="flex items-center justify-between rounded-full bg-white border-2 border-sidebar-border pr-2 pl-4">
          <input
            className="grow outline-none border-0 field-sizing-fixed h-[50px] text-sm md:text-base"
            placeholder="What can I generate for you?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className={cn(
              'rounded-full py-2 px-3 md:px-4',
              loading ? 'bg-none' : 'bg-purple-500 hover:bg-purple-400',
              !prompt.trim() ? 'opacity-50 hover:bg-purple-500' : 'opacity-100'
            )}
            onClick={callAPI}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <div
                className="w-6 h-6 bg-purple-500 rounded-sm animate-spin transition duration-700"
                style={{ animationDuration: '3s' }}
              />
            ) : (
              <CornerRightUp
                className={cn(
                  'w-4 h-4 transition-opacity text-white',
                  !prompt.trim() ? 'opacity-50' : 'opacity-100'
                )}
              />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 px-2">
          {loading
            ? 'Generating images...'
            : 'Enter a prompt to generate an image.'}
        </p>
      </div>
    </div>
  );
}
