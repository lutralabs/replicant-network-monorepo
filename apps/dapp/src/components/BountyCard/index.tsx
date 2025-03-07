import Link from 'next/link';

import type { BountyCard as BountyCardType } from '@/hooks/useGetBounties';
import { bountyStatus, getTimeRemaining } from '@/lib/utils';
import { formatEther } from 'viem';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type BaseBountyCardProps = {
  bounty: BountyCardType;
};

type ActiveBountyProps = BaseBountyCardProps & {
  status: 'submissions';
};

type VotingBountyProps = BaseBountyCardProps & {
  status: 'voting' | 'stale';
};

type FinishedBountyProps = BaseBountyCardProps & {
  status: 'completed' | 'failed';
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
        <Badge variant="blue">Submissions</Badge>
      </div>
      <div className="flex items-end justify-between text-sm">
        <div className="flex items-center gap-x-1 text-sm text-gray-600">
          <span className="text-md font-medium text-black">
            {props.bounty.numSubmissions ?? 0}
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
              {formatEther(props.bounty.amountRaised)} MON
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
        <Link href={`/bounties/${props.bounty.id}`}>
          <Button size="sm" variant="cta-solid">
            Submit a Model
          </Button>
        </Link>
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
        <Badge
          variant={`${bountyStatus(props.bounty) === 'stale' ? 'tertiary' : 'orange'}`}
        >
          {bountyStatus(props.bounty) === 'stale' ? 'Stale' : 'Voting'}
        </Badge>
      </div>
      <div className="flex items-end justify-between text-sm">
        <div className="flex items-center gap-x-1 text-sm text-gray-600">
          <span className="text-md font-medium text-black">
            {props.bounty.numSubmissions ?? 0}
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
              {formatEther(props.bounty.amountRaised)} MON
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
        <Link href={`/bounties/${props.bounty.id}`}>
          <Button size="sm" variant="cta-solid">
            {bountyStatus(props.bounty) === 'stale'
              ? 'Finalize Bounty'
              : 'Submit a Vote'}
          </Button>
        </Link>
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
            {props.bounty.numSubmissions ?? 0}
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
              {formatEther(props.bounty.amountRaised)} MON
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
        <Link href={`/bounties/${props.bounty.id}`}>
          <Button size="sm" variant="cta-solid">
            View Bounty
          </Button>
        </Link>
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
            {props.bounty.numFunders ?? 0}
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
              {formatEther(props.bounty.amountRaised)} MON
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center">
        <Link href={`/bounties/${props.bounty.id}`}>
          <Button size="sm" variant="cta-solid">
            Fund Bounty
          </Button>
        </Link>
      </div>
    </BaseBountyCard>
  );
};

const BaseBountyCard: React.FC<
  BaseBountyCardProps & { children?: React.ReactNode }
> = ({ bounty, children }) => {
  return (
    // <Link href={`/bounties/${bounty.id}`}>
    <div className="border-sidebar-border flex h-[280px] w-[380px] flex-col rounded-md border-2 bg-white px-8 py-4 hover:scale-105 transition-transform duration-200">
      <div>
        <div className="truncate text-lg font-semibold">{bounty.title}</div>
        <div className="line-clamp-3 text-sm text-gray-600">
          {bounty.description}
        </div>
      </div>
      {children}
    </div>
    // </Link>
  );
};

export const BountyCard: React.FC<BountyCardProps> = (props) => {
  switch (props.status) {
    case 'submissions':
      return <ActiveBountyCard {...props} />;
    case 'stale':
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
