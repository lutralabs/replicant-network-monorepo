import Link from 'next/link';

import { Badge } from '../ui/badge';
import type { Bounty } from '@/hooks/useReadBounties';
import { formatEther } from 'viem';
import { getTimeRemaining } from '@/lib/utils';

type BaseBountyCardProps = {
  bounty: Bounty;
};

type ActiveBountyProps = BaseBountyCardProps & {
  status: 'active';
  submissions: number;
};

type VotingBountyProps = BaseBountyCardProps & {
  status: 'voting';
  submissions: number;
};

type FinishedBountyProps = BaseBountyCardProps & {
  status: 'completed' | 'failed';
  submissions: number;
};

type CrowdfundingBountyProps = BaseBountyCardProps & {
  status: 'crowdfunding';
};

export type BountyCardProps =
  | ActiveBountyProps
  | VotingBountyProps
  | FinishedBountyProps
  | CrowdfundingBountyProps;

const ActiveBountyCard: React.FC<ActiveBountyProps> = (props) => {
  return (
    <BaseBountyCard {...props}>
      <div className="flex grow items-start justify-between gap-x-2 pt-4">
        <div className="flex items-center gap-x-2 text-sm text-gray-600">
          By
          <Badge>{`${props.bounty.creator.slice(0, 6)}...${props.bounty.creator.slice(-4)}`}</Badge>
        </div>
        <Badge variant="secondary">Active</Badge>
      </div>
      <div className="flex items-end justify-between text-sm">
        <div className="flex items-center gap-x-1 text-sm text-gray-600">
          <span className="text-md font-medium text-black">
            {props.submissions ?? 0}
          </span>
          Submissions
        </div>

        <div className="flex flex-col items-end text-sm text-gray-600">
          <div className="text-md font-medium text-black">
            {getTimeRemaining(props.bounty)}
          </div>
          <div>
            Bounty:{' '}
            <span className="text-md font-semibold text-black">
              {formatEther(props.bounty.totalRaised)} MON
            </span>
          </div>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const VotingBountyProps: React.FC<VotingBountyProps> = (props) => {
  return (
    <BaseBountyCard {...props}>
      <div className="flex grow items-start justify-between gap-x-2 pt-4">
        <div className="flex items-center gap-x-2 text-sm text-gray-600">
          By
          <Badge>{`${props.bounty.creator.slice(0, 6)}...${props.bounty.creator.slice(-4)}`}</Badge>
        </div>
        <Badge variant="default">Voting</Badge>
      </div>
      <div className="flex items-end justify-between text-sm">
        <div className="flex items-center gap-x-1 text-sm text-gray-600">
          <span className="text-md font-medium text-black">
            {props.submissions ?? 0}
          </span>
          Submissions
        </div>

        <div className="flex flex-col items-end text-sm text-gray-600">
          <div className="text-md font-medium text-black">
            {getTimeRemaining(props.bounty)}
          </div>
          <div>
            Bounty:{' '}
            <span className="text-md font-semibold text-black">
              {formatEther(props.bounty.totalRaised)} MON
            </span>
          </div>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const CompletedBountyCard: React.FC<FinishedBountyProps> = (props) => {
  return (
    <BaseBountyCard {...props}>
      <div className="flex grow items-start justify-between gap-x-2 pt-4">
        <div className="flex items-center gap-x-2 text-sm text-gray-600">
          By
          <Badge>{`${props.bounty.creator.slice(0, 6)}...${props.bounty.creator.slice(-4)}`}</Badge>
        </div>
        <Badge
          variant={`${props.status === 'completed' ? 'secondary' : 'destructive'}`}
        >
          {props.status}
        </Badge>
      </div>
      <div className="flex items-end justify-between text-sm">
        <div className="flex items-center gap-x-1 text-sm text-gray-600">
          <span className="text-md font-medium text-black">
            {props.submissions ?? 0}
          </span>
          Submissions
        </div>

        <div className="flex flex-col items-end text-sm text-gray-600">
          <div className="text-md font-medium text-black">
            {getTimeRemaining(props.bounty)}
          </div>
          <div>
            Bounty:{' '}
            <span className="text-md font-semibold text-black">
              {formatEther(props.bounty.totalRaised)} MON
            </span>
          </div>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const CrowdfundingBountyCard: React.FC<CrowdfundingBountyProps> = (props) => {
  return (
    <BaseBountyCard {...props}>
      <div className="flex grow items-start justify-between gap-x-2 pt-4">
        <div className="flex items-center gap-x-2 text-sm text-gray-600">
          By
          <Badge>{`${props.bounty.creator.slice(0, 6)}...${props.bounty.creator.slice(-4)}`}</Badge>
        </div>
        <Badge variant="default">Crowdfunding</Badge>
      </div>
      <div className="flex items-end justify-between text-sm">
        <div className="flex items-center gap-x-1 text-sm text-gray-600">
          <span className="text-md font-medium text-black">
            {props.bounty.totalFunders ?? 0}
          </span>
          Crowdfunders
        </div>

        <div className="flex flex-col items-end text-sm text-gray-600">
          <div className="text-md font-medium text-black">
            {getTimeRemaining(props.bounty)}
          </div>
          <div>
            Bounty:{' '}
            <span className="text-md font-semibold text-black">
              {formatEther(props.bounty.totalRaised)} MON
            </span>
          </div>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const BaseBountyCard: React.FC<
  BaseBountyCardProps & { children?: React.ReactNode }
> = ({ bounty, children }) => {
  return (
    <Link href={`/bounties/${bounty.id}`}>
      <div className="border-sidebar-border flex h-[240px] w-[380px] flex-col rounded-md border-2 bg-white px-8 py-4 hover:cursor-pointer hover:opacity-90">
        <div>
          <div className="truncate text-lg font-semibold">{bounty.title}</div>
          <div className="line-clamp-3 text-sm text-gray-600">
            {bounty.description}
          </div>
        </div>
        {children}
      </div>
    </Link>
  );
};

export const BountyCard: React.FC<BountyCardProps> = (props) => {
  switch (props.status) {
    case 'active':
      return <ActiveBountyCard {...props} />;
    case 'voting':
      return <VotingBountyProps {...props} />;
    case 'completed':
    case 'failed':
      return <CompletedBountyCard {...props} />;
    case 'crowdfunding':
      return <CrowdfundingBountyCard {...props} />;
    default:
      return null;
  }
};
