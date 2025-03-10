'use client';

import { Crowdfunders } from '@/app/bounties/[bounty]/Crowdfunders';
import { Details } from '@/app/bounties/[bounty]/Details';
import { Overview } from '@/app/bounties/[bounty]/Overview';
import { Submissions } from '@/app/bounties/[bounty]/Submissions';
import { BountyInfo } from '@/components/BountyInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetBounty } from '@/hooks/useGetBounty';
import { bountyStatus } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import SwapCard from '@/components/SwapCard';
import { CircleDashed, Trophy } from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const slug = pathNames[pathNames.length - 1];

  const { bounty, isLoading } = useGetBounty(Number(slug));
  console.log('BNTY', bounty);
  const { wallets } = useWallets();
  const wallet = wallets?.[0];

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

      <div className="flex flex-col lg:flex-row justify-between gap-6 mt-8">
        <div className="flex-1">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white border">
              <TabsTrigger value="overview" className="flex-1 sm:flex-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1 sm:flex-none">
                Details
              </TabsTrigger>
              <TabsTrigger value="crowdfunders" className="flex-1 sm:flex-none">
                Crowdfunders
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                disabled={status === 'crowdfunding'}
                className="flex-1 sm:flex-none"
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

        {['crowdfunding', 'failed'].includes(status) ? (
          <div className="w-full lg:w-[350px]">
            <SwapCard
              bounty={bounty}
              mode={status === 'crowdfunding' ? 'buy' : 'sell'}
            />
          </div>
        ) : status === 'submissions' ? (
          <div className="w-full lg:w-[350px]">
            <div className="bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 rounded-lg p-5">
              <h3 className="text-lg font-medium mb-2">Developers Wanted!</h3>
              <p className="text-gray-600 mb-4">
                This bounty is open for model submissions. Submit your model to
                earn the bounty reward plus{' '}
                {bounty.developerFeePercentage || 'a percentage'}% of ongoing
                token rewards.
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
          </div>
        ) : status === 'stale' ? (
          <div className="w-full lg:w-[350px]">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-5">
              <h3 className="text-lg font-medium mb-2">Action Required</h3>
              <p className="text-gray-600 mb-4">
                This bounty has passed its deadline and needs to be finalized. A
                transaction is required to update its status to completed or
                failed.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/bounties/${bounty.id}/finalize`}
                  className="w-full"
                >
                  <Button variant="cta-gradient" className="w-full">
                    Finalize Bounty
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : status === 'voting' && isUserFunder ? (
          <div className="w-full lg:w-[350px]">
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
          </div>
        ) : status === 'completed' ? (
          <div className="w-full lg:w-[350px]">
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
