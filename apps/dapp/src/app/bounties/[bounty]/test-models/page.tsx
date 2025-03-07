'use client';
import Image from 'next/image';
import { useState } from 'react';

import { BountyInfo } from '@/components/BountyInfo';
import { DynamicImage } from '@/components/DynamicImage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGetBounty } from '@/hooks/useGetBounty';
import { bountyStatus } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function Page() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { wallets, ready: walletsLoading } = useWallets();
  const { authenticated } = usePrivy();
  const wallet = wallets?.[0];

  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const slug = pathNames[pathNames.length - 2];

  const {
    bounty,
    isLoading: bountyLoading,
    error: bountyError,
  } = useGetBounty(Number(slug));

  if (bountyLoading) {
    return (
      <div className="w-full h-full pb-12 flex flex-col items-center justify-center gap-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (bountyError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load bounty information: {bountyError.message}
        </AlertDescription>
      </Alert>
    );
  }

  const currentPhase = bountyStatus(bounty);
  const isVotingPhase = currentPhase === 'voting';

  // if (!isVotingPhase) {
  //   return (
  //     <div className="w-full h-full pb-12 flex flex-col gap-y-12">
  //       <BountyInfo bounty={bounty} button={false} />
  //       <Alert>
  //         <AlertCircle className="h-4 w-4" />
  //         <AlertTitle>Not Available</AlertTitle>
  //         <AlertDescription>
  //           Testing models is only available during the voting phase. Current
  //           phase: {currentPhase}
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   );
  // }

  if (!authenticated) {
    return (
      <div className="w-full h-full pb-12 flex flex-col gap-y-12">
        <BountyInfo bounty={bounty} button={false} />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please connect your wallet to test models.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!walletsLoading) {
    return (
      <div className="w-full h-full pb-12 flex flex-col gap-y-12">
        <BountyInfo bounty={bounty} button={false} />
        <div className="flex justify-center">
          <Skeleton className="h-12 w-1/3" />
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="w-full h-full pb-12 flex flex-col gap-y-12">
        <BountyInfo bounty={bounty} button={false} />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Required</AlertTitle>
          <AlertDescription>
            No wallet found. Please connect a wallet to test models.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const validateAndSign = async () => {
    setError(null);

    // Validate prompt
    if (!prompt || prompt.trim() === '') {
      setError('Please enter a prompt first');
      return;
    }

    // Validate bounty has submissions
    if (!bounty?.submissionIds?.length) {
      setError('No models available to test');
      return;
    }

    try {
      await personalSign();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign prompt';
      setError(`Signing error: ${errorMessage}`);
      toast.error('Failed to sign prompt');
    }
  };

  const personalSign = async () => {
    const address = wallet.address;
    const message = prompt;

    try {
      const provider = await wallet.getEthereumProvider();
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, address],
      });

      await callAPI(signature, address);
    } catch (error) {
      console.error('Signing error:', error);
      throw error;
    }
  };

  const callAPI = async (signedMessage: string, address: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/infer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          signedMessage,
          address,
          bountyId: bounty.id.toString(),
          models: bounty.submissionIds.map((id) => ({ hash: id })),
        }),
      });

      // Improved error handling to display actual API error messages
      if (!res.ok) {
        const contentType = res.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          // If the response is JSON, try to extract the error message
          const errorResponse = await res.json();
          // Extract error message from response - might be in different formats depending on API
          const errorMessage =
            typeof errorResponse === 'string'
              ? errorResponse
              : errorResponse.message ||
                errorResponse.error ||
                errorResponse.data ||
                res.statusText;

          throw new Error(errorMessage);
        }
        // If not JSON, get the text response
        const errorText = await res.text();
        throw new Error(errorText || `Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setImages(data.data);
      toast.success('Images generated successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate images';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full pb-12 flex flex-col justify-between gap-y-8">
      <BountyInfo bounty={bounty} button={false} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6 flex justify-center flex-wrap gap-x-12 gap-y-12">
        {loading ? (
          <>
            {bounty.submissionIds.map((model) => (
              <Skeleton
                key={`skeleton-${model}`}
                className="w-[256px] h-[256px] rounded-lg"
              />
            ))}
          </>
        ) : (
          <>
            {images.length > 0 &&
              images.map((image, modelId) => {
                if (image.images?.length > 0) {
                  return (
                    <div
                      key={`image-${image.id}`}
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
                return null;
              })}
          </>
        )}
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between rounded-full bg-white border-2 border-sidebar-border pr-2 pl-2">
          <input
            className="grow outline-none border-0 field-sizing-fixed h-[50px]"
            placeholder="What can I generate for you?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <Button
            size="sm"
            className="rounded-full bg-gray-200 border-0 hover:bg-gray-100"
            icon
            onClick={validateAndSign}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 px-2">
          Enter a prompt to test the models and help evaluate their performance.
        </p>
      </div>
    </div>
  );
}
