import Link from 'next/link';

import type { BountyCard as BountyCardType } from '@/hooks/useGetBounties';
import { bountyStatus, getTimeRemaining } from '@/lib/utils';
import { formatEther } from 'viem';
import { Badge } from '../ui/badge';
import { ArrowRight, Clock, Users } from 'lucide-react';

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
    <BaseBountyCard {...props} statusColor="blue">
      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {props.bounty.numSubmissions ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <Link href={`/bounties/${props.bounty.id}`} className="group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-blue-50">
              <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:text-blue-600 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const VotingBountyProps: React.FC<VotingBountyProps> = (props) => {
  const isStale = bountyStatus(props.bounty) === 'stale';

  return (
    <BaseBountyCard {...props} statusColor={isStale ? 'amber' : 'orange'}>
      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {props.bounty.numSubmissions ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <Link href={`/bounties/${props.bounty.id}`} className="group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-orange-50">
              <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:text-orange-600 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const CompletedBountyCard: React.FC<FinishedBountyProps> = (props) => {
  const isCompleted = props.status === 'completed';

  return (
    <BaseBountyCard {...props} statusColor={isCompleted ? 'green' : 'red'}>
      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {props.bounty.numSubmissions ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <Link href={`/bounties/${props.bounty.id}`} className="group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
              <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const CrowdfundingBountyCard: React.FC<CrowdfundingBountyProps> = (props) => {
  const percentFunded = Math.min(
    100,
    (Number(formatEther(props.bounty.amountRaised)) / 100) * 100
  );

  return (
    <BaseBountyCard {...props} statusColor="purple">
      <div className="mt-2">
        <div className="h-1 w-full rounded-full bg-gray-100">
          <div
            className="h-1 rounded-full bg-purple-400"
            style={{ width: `${percentFunded}%` }}
          />
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {props.bounty.numFunders ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <Link href={`/bounties/${props.bounty.id}`} className="group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-purple-50">
              <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:text-purple-600 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const BaseBountyCard: React.FC<
  BaseBountyCardProps & {
    children?: React.ReactNode;
    statusColor: 'blue' | 'orange' | 'amber' | 'green' | 'red' | 'purple';
  }
> = ({ bounty, children, statusColor }) => {
  const statusLabels = {
    blue: 'Submissions',
    orange: 'Voting',
    amber: 'Stale',
    green: 'Completed',
    red: 'Failed',
    purple: 'Crowdfunding',
  };

  return (
    <div className="flex h-[220px] w-[320px] flex-col rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`h-2.5 w-2.5 rounded-full bg-${statusColor}-500`} />
          <span className="text-xs font-medium text-gray-500">
            {statusLabels[statusColor]}
          </span>
        </div>

        <div className="text-xs text-gray-400">
          {`${bounty.creator.slice(0, 4)}...${bounty.creator.slice(-4)}`}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="truncate text-lg font-medium">{bounty.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
          {bounty.description}
        </p>
      </div>

      {children}
    </div>
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
