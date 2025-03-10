import { FundBountyDialog } from '@/app/bounties/[bounty]/FundBountyDialog';
import { bountyStatus } from '@/lib/utils';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { formatEther } from 'viem';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Bounty } from '@/hooks/useGetBounty';
import { useWallets } from '@privy-io/react-auth';

export const BountyInfo = ({
  bounty,
  button,
}: {
  bounty: Bounty;
  button?: boolean;
}) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const variant = useMemo(() => {
    switch (bountyStatus(bounty)) {
      case 'submissions':
        return 'blue';
      case 'completed':
        return 'secondary';
      case 'voting':
        return 'tertiary';
      case 'crowdfunding':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'stale':
        return 'orange';
    }
  }, [bounty]);

  const isUserFunder = useMemo(() => {
    if (!wallet) return false;
    return bounty.funders.some(
      (funder) =>
        funder.funder_id.toLowerCase() === wallet.address.toLowerCase()
    );
  }, [bounty, wallet]);

  const ctaText = useMemo(() => {
    if (button === false) return;

    switch (bountyStatus(bounty)) {
      case 'submissions':
        return 'Submit a Model';
      case 'completed':
        return 'Use Winning Model';
      case 'voting':
        return isUserFunder ? 'Vote' : undefined;
      case 'crowdfunding':
        return 'Fund Bounty';
      case 'failed':
        return undefined;
      case 'stale':
        return undefined;
    }
  }, [bounty, isUserFunder]);

  const ctaLink = useMemo(() => {
    switch (bountyStatus(bounty)) {
      case 'submissions':
        return `/bounties/${bounty.id}/submit-model`;
      case 'completed':
        return `/models/${bounty.winner}`;
      case 'voting':
        return `/bounties/${bounty.id}/vote`;
      case 'crowdfunding':
        return undefined;
      case 'failed':
        return undefined;
      case 'stale':
        return undefined;
    }
  }, [bounty]);

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="max-w-[500px]">
          <div className="text-lg font-semibold">{bounty.title}</div>
          <div className="text-md mt-2 text-gray-600">
            Bounty for a Custom Model Created on Replicant Network
          </div>
        </div>
        {bountyStatus(bounty) === 'voting' && !isUserFunder ? (
          <div className="text-gray-600">
            You did not participate in this bounty
          </div>
        ) : (
          ctaText &&
          (ctaText === 'Fund Bounty' ? (
            <FundBountyDialog bounty={bounty} />
          ) : (
            <Link href={ctaLink}>
              <Button variant="cta-solid">{ctaText} &gt;</Button>
            </Link>
          ))
        )}
      </div>
      <div className="mt-6 w-full">
        <div className="flex justify-start gap-x-12 items-center text-gray-600">
          <Badge className="text-md px-3 capitalize" variant={variant}>
            {bountyStatus(bounty)}
          </Badge>
          <div>
            Bounty:{' '}
            <span className="text-md font-semibold text-black">
              {formatEther(bounty.amountRaised)} MON
            </span>
          </div>
          <div>
            Crowdfunders:{' '}
            <span className="text-md font-semibold text-black">
              {bounty.numFunders}
            </span>
          </div>
          <div>
            Start Date:{' '}
            <span className="text-md font-semibold text-black">
              {new Date(Number(bounty.created_at) * 1000).toLocaleDateString()}
            </span>
          </div>
          <div>
            End Date:{' '}
            <span className="text-md font-semibold text-black">
              {new Date(
                Number(bounty.votingPhaseEnd) * 1000
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="w-full h-[1px] mt-1 bg-gray-300" />
      </div>
    </div>
  );
};
