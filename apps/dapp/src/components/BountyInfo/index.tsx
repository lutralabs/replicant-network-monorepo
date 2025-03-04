import { FundBountyDialog } from '@/app/bounties/[bounty]/FundBountyDialog';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { bountyStatus } from '@/lib/utils';
import type { Bounty } from '@/hooks/useGetBounties';
import { formatEther } from 'viem';

export const BountyInfo = ({ bounty }: { bounty: Bounty }) => {
  const variant = useMemo(() => {
    switch (bountyStatus(bounty)) {
      case 'active':
      case 'completed':
        return 'secondary';
      case 'voting':
      case 'crowdfunding':
        return 'default';
      case 'failed':
        return 'destructive';
    }
  }, [bounty]);

  const ctaText = useMemo(() => {
    switch (bountyStatus(bounty)) {
      case 'active':
        return 'Submit a Model';
      case 'completed':
        return 'Use Winning Model';
      case 'voting':
        return 'Vote';
      case 'crowdfunding':
        return 'Fund the Bounty';
      case 'failed':
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
        {ctaText &&
          (ctaText === 'Fund the Bounty' ? (
            <FundBountyDialog bounty={bounty} />
          ) : (
            <Link href={'/bounties/bounty-form'}>
              <Button variant="cta-solid">{ctaText} &gt;</Button>
            </Link>
          ))}
      </div>
      <div className="mt-6 w-full">
        <div className="flex justify-start gap-x-12 items-center text-gray-600">
          <Badge className="text-md px-3" variant={variant}>
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
            <span className="text-md font-semibold text-black">TBD</span>
          </div>
          <div>
            End Date:{' '}
            <span className="text-md font-semibold text-black">
              {new Date(Number(bounty.votingPhaseEnd)).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="w-full h-[1px] mt-1 bg-gray-300" />
      </div>
    </div>
  );
};
