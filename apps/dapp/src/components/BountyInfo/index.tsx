import { FundBountyDialog } from '@/app/bounties/[bounty]/FundBountyDialog';
import { bountyStatus } from '@/lib/utils';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { formatEther } from 'viem';
import { Button } from '../ui/button';
import type { Bounty } from '@/hooks/useGetBounty';
import { useWallets } from '@privy-io/react-auth';
import { CalendarIcon, Users, Clock, FileText } from 'lucide-react';
import { BountyPhasesStepper } from '../BountyPhasesStepper';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export const BountyInfo = ({
  bounty,
  button,
  showStepper = false,
}: {
  bounty: Bounty;
  button?: boolean;
  showStepper?: boolean;
}) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  // Helper function to format remaining time
  const getTimeRemaining = (endTimestamp: number) => {
    const now = Date.now();
    const endTime = endTimestamp * 1000; // Convert to milliseconds
    const remainingMs = endTime - now;

    if (remainingMs <= 0) return 'Ended';

    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 7) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''} left`;
    }
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} left`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  };

  // Get the current phase end time
  const getCurrentPhaseEndTime = () => {
    const status = bountyStatus(bounty);

    switch (status) {
      case 'crowdfunding':
        return bounty.fundingPhaseEnd;
      case 'submissions':
        return bounty.submissionPhaseEnd;
      case 'voting':
        return bounty.votingPhaseEnd;
      default:
        return 0;
    }
  };

  const showSubmissionsCount = bountyStatus(bounty) !== 'crowdfunding';
  const currentPhaseEndTime = getCurrentPhaseEndTime();
  const timeRemaining = currentPhaseEndTime
    ? getTimeRemaining(Number(currentPhaseEndTime))
    : null;
  const endDateFormatted = currentPhaseEndTime
    ? new Date(Number(currentPhaseEndTime) * 1000).toLocaleString()
    : null;

  // Function to get bounty phases for the stepper
  const getBountyPhases = (): {
    id: string;
    name: string;
    description?: string;
    status: 'complete' | 'current' | 'upcoming' | 'failed' | 'stale';
  }[] => {
    const status = bountyStatus(bounty);

    const phases = [
      {
        id: 'crowdfunding',
        name: 'Crowdfunding',
        status:
          status === 'crowdfunding'
            ? ('current' as const)
            : status === 'failed'
              ? ('failed' as const)
              : ('complete' as const),
      },
      {
        id: 'submissions',
        name: 'Submissions',
        status:
          status === 'submissions'
            ? ('current' as const)
            : status === 'failed'
              ? ('upcoming' as const)
              : status === 'crowdfunding'
                ? ('upcoming' as const)
                : ('complete' as const),
      },
      {
        id: 'voting',
        name: 'Voting',
        status:
          status === 'voting'
            ? ('current' as const)
            : status === 'failed' ||
                status === 'completed' ||
                status === 'stale'
              ? ('complete' as const)
              : ('upcoming' as const),
      },
      {
        id: 'completed',
        name: 'Completed',
        status:
          status === 'completed'
            ? ('complete' as const)
            : status === 'stale'
              ? ('current' as const)
              : status === 'failed'
                ? ('failed' as const)
                : ('upcoming' as const),
      },
    ];

    return phases;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
      <div className="flex w-full items-center justify-between">
        <div className="max-w-[70%]">
          <h1 className="text-2xl font-semibold tracking-tight">
            {bounty.title}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4" />
              <span>{bounty.numFunders} funders</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <CalendarIcon className="h-4 w-4" />
              <span>
                Created{' '}
                {new Date(
                  Number(bounty.created_at) * 1000
                ).toLocaleDateString()}
              </span>
            </div>
            {showSubmissionsCount && (
              <div className="flex items-center gap-1 text-sm">
                <FileText className="h-4 w-4" />
                <span>{bounty.numSubmissions || 0} submissions</span>
              </div>
            )}
            {timeRemaining && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                      <Clock className="h-4 w-4" />
                      <span>{timeRemaining}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ends on {endDateFormatted}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Bounty Amount</div>
            <div className="text-2xl font-semibold text-primary">
              {formatEther(bounty.amountRaised)}{' '}
              <span className="text-base">MON</span>
            </div>
          </div>
        </div>
      </div>

      {showStepper && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <BountyPhasesStepper
            currentPhase={bountyStatus(bounty)}
            phases={getBountyPhases()}
          />
        </div>
      )}
    </div>
  );
};
