'use client';

import { ModelCard } from '@/components/ModelCard';
import { type BountyCard, useGetBounties } from '@/hooks/useGetBounties';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const findWinningSubmission = (bounty: BountyCard) => {
  if (!bounty.submissions || bounty.submissions.length === 0) return '';

  // Find submission with most votes
  let winningSubmission = bounty.submissions[0];
  let maxVotes = 0;

  for (const submission of bounty.submissions) {
    const voteCount = submission.votes ? submission.votes.length : 0;
    if (voteCount > maxVotes) {
      maxVotes = voteCount;
      winningSubmission = submission;
    }
  }

  return winningSubmission.id.split('0x')[1];
};

export default function Page() {
  const { bounties, isLoading, error } = useGetBounties();

  // Filter for finalized bounties with a winner
  const models = bounties
    .filter((bounty) => bounty.finalized && bounty.winner)
    .map((bounty) => ({
      title: bounty.title || 'Untitled Model',
      description: bounty.description || 'No description available',
      modelHash: findWinningSubmission(bounty),
      id: bounty.id.toString(),
    }));

  return (
    <div className="w-full">
      <div className="w-[500px]">
        <div className="text-lg font-semibold">Models</div>
        <div className="text-md mt-2 text-gray-600">
          A list of comprehensive models developed by global community of Web2
          and Web3 developers through the crowdfunding campaigns.
        </div>
      </div>

      {isLoading && (
        <div className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[350px]">
              <Skeleton className="h-[200px] w-full rounded-md" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-12 text-red-500">
          Failed to load models. Please try again later.
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12">
          {models.length > 0 ? (
            models.map((model) => <ModelCard key={model.id} {...model} />)
          ) : (
            <div className="w-full text-center p-12 border border-dashed rounded-lg">
              <p className="text-gray-500">No completed models found yet.</p>
              <p className="text-gray-400 mt-2">
                Models will appear here once bounties have been finalized with
                winning submissions.
              </p>
              <Link
                href="/bounties"
                className="text-purple-600 hover:text-purple-800 underline mt-6 inline-block"
              >
                Browse active bounties
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
