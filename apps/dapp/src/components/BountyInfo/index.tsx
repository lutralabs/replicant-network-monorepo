import { FundBountyDialog } from '@/app/bounties/[bounty]/FundBountyDialog';
import type { Bounty } from '@/constants/bounties';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const BountyInfo = ({ bounty }: { bounty: Bounty }) => {
  const variant = useMemo(() => {
    switch (bounty.status) {
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
    switch (bounty.status) {
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
          <div className="text-md mt-2 text-gray-600">{bounty.subtitle}</div>
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
            {bounty.status}
          </Badge>
          <div>
            Bounty:{' '}
            <span className="text-md font-semibold text-black">
              {bounty.reward} MON
            </span>
          </div>
          <div>
            Crowdfunders:{' '}
            <span className="text-md font-semibold text-black">
              {bounty.crowdfunders}
            </span>
          </div>
          <div>
            Start Date:{' '}
            <span className="text-md font-semibold text-black">
              {new Date(
                Number(bounty.createdTimestamp) * 1000
              ).toLocaleDateString()}
            </span>
          </div>
          <div>
            End Date:{' '}
            <span className="text-md font-semibold text-black">
              {new Date(
                Number(bounty.createdTimestamp) * 1000 +
                  3 * 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="w-full h-[1px] mt-1 bg-gray-300" />
      </div>
    </div>
  );
};
