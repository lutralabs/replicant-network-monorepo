'use client';

import { Crowdfunders } from '@/app/(home)/bounties/[bounty]/Crowdfunders';
import { Details } from '@/app/(home)/bounties/[bounty]/Details';
import { Overview } from '@/app/(home)/bounties/[bounty]/Overview';
import { Submissions } from '@/app/(home)/bounties/[bounty]/Submissions';
import { BountyInfo } from '@/components/BountyInfo';
import SwapCard from '@/components/SwapCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinalizeBounty } from '@/hooks/useFinalizeBounty';
import { useGetBounty } from '@/hooks/useGetBounty';
import { bountyStatus, formatBalance } from '@/lib/utils';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { CircleDashed, Trophy, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useBalance } from 'wagmi';

// Token Balance Card Component
function TokenBalanceCard({
  bounty,
  walletAddress,
}: { bounty: any; walletAddress: string | undefined }) {
  // Get token balance using the same approach as SwapCard
  const tokenBalance = useBalance({
    address: (walletAddress ?? '0x0') as `0x${string}`,
    token: bounty.token as `0x${string}`,
    config,
  });

  // Format the token balance
  const formattedTokenBalance = useMemo(() => {
    if (!tokenBalance || !tokenBalance.data) return '0';
    const formattedBalance = formatBalance(tokenBalance.data.value);
    return formattedBalance.toFixed(2);
  }, [tokenBalance.data]);

  const isLoading = tokenBalance.isLoading;

  return (
    <Card className="w-full mb-4 shadow-sm border-0">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Wallet className="h-4 w-4 mr-2 text-purple-600" />
            <span className="text-sm font-medium">Your Model Tokens</span>
          </div>
          {isLoading && (
            <CircleDashed className="h-4 w-4 animate-spin text-purple-600" />
          )}
        </div>

        <div className="flex items-baseline">
          <span className="text-2xl font-semibold text-slate-800">
            {isLoading ? '—' : formattedTokenBalance}
          </span>
          <span className="ml-2 text-sm text-slate-500">
            {tokenBalance.data?.symbol || bounty.tokenSymbol || 'TOKENS'}
          </span>
        </div>

        <p className="text-xs text-slate-600 mt-3">
          {['crowdfunding', 'failed'].includes(bountyStatus(bounty))
            ? "By purchasing tokens, you fund this AI model's development and gain ownership rights to a portion of the winning model's future revenue."
            : "Token holders participate in bounty governance and share in the model's ongoing rewards."}
        </p>
      </div>
    </Card>
  );
}

export default function Page() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const slug = pathNames[pathNames.length - 1];

  const { bounty, isLoading } = useGetBounty(Number(slug));
  const { wallets } = useWallets();
  const wallet = wallets?.[0];
  const { mutateAsync: finalizeBounty, isPending: isFinalizingBounty } =
    useFinalizeBounty();

  console.log('bnty', bounty);

  // Determine current status

  const isUserFunder = useMemo(() => {
    if (!wallet || isLoading) return false;
    return bounty.funders.some(
      (funder) =>
        funder.funder_id.toLowerCase() === wallet.address.toLowerCase()
    );
  }, [bounty, wallet]);

  const status = useMemo(() => {
    if (isLoading) return 'loading';
    return bountyStatus(bounty);
  }, [bounty, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <CircleDashed className="h-10 w-10 animate-spin text-primary/70" />
          <p className="mt-4 text-gray-500">Loading bounty details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-12">
      <BountyInfo bounty={bounty} showStepper={true} />

      {/* Mobile layout: Show cards above tabs */}
      <div className="block lg:hidden my-6">
        <TokenBalanceCard bounty={bounty} walletAddress={wallet?.address} />

        {/* Conditional action cards based on status */}
        {['crowdfunding', 'failed'].includes(status) ? (
          <div id="swap-section">
            <SwapCard
              bounty={bounty}
              mode={status === 'crowdfunding' ? 'buy' : 'sell'}
            />
          </div>
        ) : status === 'submissions' ? (
          <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-lg p-5">
            <h3 className="text-lg font-medium mb-2">Developers Wanted!</h3>
            <p className="text-gray-600 mb-4">
              This bounty is open for model submissions. Submit your model to
              earn the bounty reward plus{' '}
              <span className="font-bold text-purple-500 text-lg">
                {bounty.developerFeePercentage.toString() || 'a percentage'}
              </span>
              % of Model Token.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/bounties/${bounty.id}/submit-model`}
                className="w-full"
              >
                <Button variant="cta-gradient" className="w-full">
                  Submit Your Model
                </Button>
              </Link>
            </div>
          </div>
        ) : status === 'stale' ? (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-5">
            <h3 className="text-lg font-medium mb-2">Action Required</h3>
            <p className="text-gray-600 mb-4">
              This bounty has passed its deadline and needs to be finalized. A
              transaction is required to update its status to completed or
              failed.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="cta-gradient"
                className="w-full"
                onClick={() => finalizeBounty({ id: BigInt(bounty.id) })}
                disabled={isFinalizingBounty}
              >
                {isFinalizingBounty ? 'Finalizing...' : 'Finalize Bounty'}
              </Button>
            </div>
          </div>
        ) : status === 'voting' && isUserFunder ? (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-5">
            <h3 className="text-lg font-medium mb-2">Your input is needed!</h3>
            <p className="text-gray-600 mb-4">
              As a funder of this bounty, you can now test and vote for the best
              model submission.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/bounties/${bounty.id}/test-models`}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                >
                  Try Models
                </Button>
              </Link>
              <Link href={`/bounties/${bounty.id}/vote`} className="w-full">
                <Button variant="cta-gradient" className="w-full">
                  Cast Your Vote
                </Button>
              </Link>
            </div>
          </div>
        ) : status === 'completed' ? (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium mb-2">Winning Model</h3>
            <p className="text-gray-600 mb-4">
              This bounty has been successfully completed with a winning model.
              Try out the model now to see how it responds to your queries!
            </p>
            <Link
              href={`/models/${(() => {
                if (!bounty.submissions || bounty.submissions.length === 0)
                  return '';

                // Find submission with most votes
                let winningSubmission = bounty.submissions[0];
                let maxVotes = 0;

                for (const submission of bounty.submissions) {
                  const voteCount = submission.votes
                    ? submission.votes.length
                    : 0;
                  if (voteCount > maxVotes) {
                    maxVotes = voteCount;
                    winningSubmission = submission;
                  }
                }

                return winningSubmission.id.split('0x')[1];
              })()}`}
              className="w-full"
            >
              <Button variant="cta-gradient" className="w-full">
                Use Winning Model
              </Button>
            </Link>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-6 mt-8">
        <div className="flex-1 order-2 lg:order-1">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full h-[40px] shadow-sm justify-start mb-6 bg-white overflow-x-auto scrollbar-none">
              <TabsTrigger
                value="overview"
                className="flex-1 sm:flex-none whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="flex-1 sm:flex-none whitespace-nowrap"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="crowdfunders"
                className="flex-1 sm:flex-none whitespace-nowrap"
              >
                Crowdfunders
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                disabled={status === 'crowdfunding'}
                className="flex-1 sm:flex-none whitespace-nowrap"
              >
                Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <Overview bounty={bounty} />
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <Details bounty={bounty} />
            </TabsContent>

            <TabsContent value="crowdfunders" className="mt-0">
              <Crowdfunders bounty={bounty} />
            </TabsContent>

            <TabsContent value="submissions" className="mt-0">
              <Submissions bounty={bounty} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop layout: Keep cards on right side */}
        <div className="w-full lg:w-[350px] hidden lg:block order-1 lg:order-2">
          <TokenBalanceCard bounty={bounty} walletAddress={wallet?.address} />

          {/* Conditional action cards based on status */}
          {['crowdfunding', 'failed'].includes(status) ? (
            <div id="swap-section">
              <SwapCard
                bounty={bounty}
                mode={status === 'crowdfunding' ? 'buy' : 'sell'}
              />
            </div>
          ) : status === 'submissions' ? (
            <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-lg p-5">
              <h3 className="text-lg font-medium mb-2">Developers Wanted!</h3>
              <p className="text-gray-600 mb-4">
                This bounty is open for model submissions. Submit your model to
                earn the bounty reward plus{' '}
                <span className="font-bold text-purple-500 text-lg">
                  {bounty.developerFeePercentage.toString() || 'a percentage'}
                </span>
                % of Model Token.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/bounties/${bounty.id}/submit-model`}
                  className="w-full"
                >
                  <Button variant="cta-gradient" className="w-full">
                    Submit Your Model
                  </Button>
                </Link>
              </div>
            </div>
          ) : status === 'stale' ? (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-5">
              <h3 className="text-lg font-medium mb-2">Action Required</h3>
              <p className="text-gray-600 mb-4">
                This bounty has passed its deadline and needs to be finalized. A
                transaction is required to update its status to completed or
                failed.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="cta-gradient"
                  className="w-full"
                  onClick={() => finalizeBounty({ id: BigInt(bounty.id) })}
                  disabled={isFinalizingBounty}
                >
                  {isFinalizingBounty ? 'Finalizing...' : 'Finalize Bounty'}
                </Button>
              </div>
            </div>
          ) : status === 'voting' && isUserFunder ? (
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-5">
              <h3 className="text-lg font-medium mb-2">
                Your input is needed!
              </h3>
              <p className="text-gray-600 mb-4">
                As a funder of this bounty, you can now test and vote for the
                best model submission.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/bounties/${bounty.id}/test-models`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                  >
                    Try Models
                  </Button>
                </Link>
                <Link href={`/bounties/${bounty.id}/vote`} className="w-full">
                  <Button variant="cta-gradient" className="w-full">
                    Cast Your Vote
                  </Button>
                </Link>
              </div>
            </div>
          ) : status === 'completed' ? (
            <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg p-5">
              <h3 className="text-lg font-medium mb-2">Winning Model</h3>
              <p className="text-gray-600 mb-4">
                This bounty has been successfully completed with a winning
                model. Try out the model now to see how it responds to your
                queries!
              </p>
              <Link
                href={`/models/${(() => {
                  if (!bounty.submissions || bounty.submissions.length === 0)
                    return '';

                  // Find submission with most votes
                  let winningSubmission = bounty.submissions[0];
                  let maxVotes = 0;

                  for (const submission of bounty.submissions) {
                    const voteCount = submission.votes
                      ? submission.votes.length
                      : 0;
                    if (voteCount > maxVotes) {
                      maxVotes = voteCount;
                      winningSubmission = submission;
                    }
                  }

                  return winningSubmission.id.split('0x')[1];
                })()}`}
                className="w-full"
              >
                <Button variant="cta-gradient" className="w-full">
                  Use Winning Model
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
