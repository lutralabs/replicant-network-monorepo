'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { AlertCircle } from 'lucide-react';

import { BountyInfo } from '@/components/BountyInfo';
import { DynamicImage } from '@/components/DynamicImage';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBounty } from '@/hooks/useGetBounty';
import { useVote } from '@/hooks/useVote';
import { useHasVoted } from '@/hooks/useHasVoted';
import { bountyStatus } from '@/lib/utils';
import { ErrorToast } from '@/components/Toast';

type TestImage = {
  url: string;
  width: number;
  height: number;
  modelHash: string;
};

type TestPrompt = {
  promptId: number;
  prompt: string;
  images: TestImage[];
  modelHashes: string[];
};
export const VoteClient = () => {
  const [testPrompts, setTestPrompts] = useState<TestPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const { wallets, ready: walletsLoading } = useWallets();
  const { authenticated } = usePrivy();
  const wallet = wallets?.[0];

  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const slug = pathNames[pathNames.length - 2];
  const bountyId = Number(slug);

  // Fetch bounty data
  const {
    bounty,
    isLoading: bountyLoading,
    error: bountyError,
  } = useGetBounty(bountyId);

  // Get voting functions and states
  const { mutate: vote } = useVote();

  // Check if user has already voted
  const { data: hasVoted, isLoading: checkingVoteStatus } =
    useHasVoted(bountyId);

  // Fetch test images when the component mounts
  useEffect(() => {
    if (!bountyLoading) {
      fetchTestImages(bounty.id.toString());
    }
  }, [bounty, bountyLoading]);

  async function fetchTestImages(bountyId: string) {
    console.log('fetching test images');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/testImages?bountyId=${bountyId}`);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch test images');
        }
        const errorText = await response.text();
        throw new Error(
          errorText || `Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        setTestPrompts(data.data);
      } else {
        setTestPrompts([]);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred fetching test images';
      setError(message);
      console.error('Error fetching test images:', err);
    } finally {
      setLoading(false);
    }
  }

  // Function to handle voting
  async function handleVote() {
    if (!selectedModel || !wallet || !authenticated) {
      ErrorToast({
        error: 'Please select a model and connect your wallet to vote',
      });
      return;
    }

    if (hasVoted) {
      ErrorToast({ error: 'You have already voted on this bounty' });
      return;
    }

    setVotingInProgress(true);

    vote({
      model: selectedModel,
      id: BigInt(bountyId),
    });

    setVotingInProgress(false);
  }

  // Loading state
  if (bountyLoading) {
    return (
      <div className="w-full h-full pb-12 flex flex-col items-center justify-center gap-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
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

  // Check if bounty is in voting phase
  const currentPhase = bountyStatus(bounty);
  const isVotingPhase = currentPhase === 'voting';

  if (!isVotingPhase) {
    return (
      <div className="w-full h-full pb-12 flex flex-col gap-y-12">
        <BountyInfo bounty={bounty} button={false} />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Available</AlertTitle>
          <AlertDescription>
            Voting is only available during the voting phase. Current phase:{' '}
            {currentPhase}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="w-full h-full pb-12 flex flex-col gap-y-12">
        <BountyInfo bounty={bounty} button={false} />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please connect your wallet to vote.
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
            No wallet found. Please connect a wallet to vote.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BountyInfo bounty={bounty} button={false} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="px-12">
        {loading || checkingVoteStatus ? (
          <div className="flex flex-col items-center gap-y-6 mt-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        ) : testPrompts.length > 0 ? (
          <>
            <Carousel className="w-full">
              <CarouselContent>
                {testPrompts.map((promptData) => (
                  <CarouselItem key={promptData.promptId}>
                    <div className="flex flex-wrap gap-x-12 gap-y-12 justify-center mt-12">
                      {promptData.images.map((image, modelId) => (
                        <div
                          key={`${promptData.promptId}-${image.modelHash}-${modelId}`}
                          className="flex flex-col items-center gap-y-2"
                        >
                          <DynamicImage
                            alt="generated image"
                            height={image.height}
                            width={image.width}
                            src={image.url}
                          />
                          <div className="font-medium">Model {modelId + 1}</div>
                          <div className="text-xs text-gray-500">
                            Hash: {image.modelHash.slice(0, 6)}...
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center items-center mt-8 gap-x-2 text-md text-gray-600 font-medium">
                      Prompt:
                      <span className="text-lg text-black font-semibold">
                        {promptData.prompt}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className="mt-12 flex flex-col gap-y-6 max-w-md mx-auto">
              <div>
                <Label>Vote for Model</Label>
                <Select
                  onValueChange={setSelectedModel}
                  value={selectedModel || undefined}
                  disabled={hasVoted}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a model to vote for" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Get unique model hashes across all prompts */}
                    {Array.from(
                      new Set(
                        testPrompts.flatMap((p) =>
                          p.images.map((img) => img.modelHash)
                        )
                      )
                    ).map((modelHash, index) => (
                      <SelectItem key={modelHash} value={modelHash}>
                        Model {index + 1} ({modelHash.slice(0, 6)}...)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleVote}
                disabled={
                  !selectedModel ||
                  votingInProgress ||
                  !authenticated ||
                  hasVoted
                }
                className="w-full"
                variant="cta-solid"
              >
                {votingInProgress
                  ? 'Submitting Vote...'
                  : hasVoted
                    ? 'Already Voted'
                    : 'Submit Vote'}
              </Button>
            </div>
          </>
        ) : (
          <Alert className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Test Images</AlertTitle>
            <AlertDescription>
              No test images have been generated for this bounty yet.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
