import Image from 'next/image';
import Link from 'next/link';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BountyCard as BountyCardType } from '@/hooks/useGetBounties';
import { bountyStatus, getTimeRemaining } from '@/lib/utils';
import { ArrowRight, Clock, FileCheck, Sparkles, Users } from 'lucide-react';
import { formatEther } from 'viem';
import { Badge } from '../ui/badge';

type BaseBountyCardProps = {
  bounty: BountyCardType;
  featured?: boolean;
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
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-x-2">
                    <FileCheck className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {props.bounty.numSubmissions ?? 0}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of submitted models</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-800">
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-blue-50">
            <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:text-blue-600 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const VotingBountyCard: React.FC<VotingBountyProps> = (props) => {
  const isStale = bountyStatus(props.bounty) === 'stale';

  return (
    <BaseBountyCard {...props} statusColor={isStale ? 'amber' : 'orange'}>
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-x-2">
                    <FileCheck className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {props.bounty.numSubmissions ?? 0}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of submitted models</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-800">
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-orange-50">
            <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:text-orange-600 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </BaseBountyCard>
  );
};

const CompletedBountyCard: React.FC<FinishedBountyProps> = (props) => {
  const isCompleted = props.status === 'completed';
  const textColorClass = isCompleted ? 'text-green-600' : 'text-red-600';

  return (
    <BaseBountyCard {...props} statusColor={isCompleted ? 'green' : 'red'}>
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-x-2">
                    <FileCheck className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {props.bounty.numSubmissions ?? 0}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of submitted models</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={'text-base font-semibold text-gray-800'}>
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
            <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-0.5" />
          </div>
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
      <div className="mt-auto pt-4">
        <div className="mb-4">
          <div className="h-2.5 w-full rounded-full bg-gray-100">
            <div
              className="h-2.5 rounded-full bg-purple-400 transition-all duration-300"
              style={{ width: `${percentFunded}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {props.bounty.numFunders ?? 0}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of funders</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-x-2 text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{getTimeRemaining(props.bounty)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-800">
            {formatEther(props.bounty.amountRaised)} MON
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-purple-50">
            <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:text-purple-600 group-hover:translate-x-0.5" />
          </div>
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
> = ({ bounty, children, statusColor, featured }) => {
  const statusLabels = {
    blue: 'Submissions',
    orange: 'Voting',
    amber: 'Stale',
    green: 'Completed',
    red: 'Failed',
    purple: 'Crowdfunding',
  };

  // Create a mapping for status colors to Tailwind classes to avoid dynamic class issues
  const statusColorClasses = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  const statusBgClasses = {
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
    amber: 'bg-amber-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
  };

  const statusTextClasses = {
    blue: 'text-blue-700',
    orange: 'text-orange-700',
    amber: 'text-amber-700',
    green: 'text-green-700',
    red: 'text-red-700',
    purple: 'text-purple-700',
  };

  return (
    <Link
      href={`/bounties/${bounty.id}`}
      className="group block cursor-pointer w-full"
    >
      <div
        className={`flex h-[400px] w-full max-w-[340px] mx-auto flex-col rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all duration-300 
        ${
          featured
            ? 'ring-1 ring-amber-200 bg-gradient-to-b from-amber-50/40 to-white shadow-[0_10px_40px_rgba(251,191,36,0.08)]'
            : 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]'
        } 
        group-hover:translate-y-[-2px]`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-full ${statusBgClasses[statusColor]} bg-opacity-70`}
          >
            <div
              className={`h-2 w-2 rounded-full ${statusColorClasses[statusColor]} animate-pulse`}
            />
            <span
              className={`text-xs font-medium ${statusTextClasses[statusColor]}`}
            >
              {statusLabels[statusColor]}
            </span>
          </div>

          {featured ? (
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-600 px-2.5 py-1 flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">Featured</span>
            </Badge>
          ) : (
            <div className="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-full">
              {`${bounty.creator.slice(0, 4)}...${bounty.creator.slice(-4)}`}
            </div>
          )}
        </div>

        {/* Image container */}
        <div className="mt-4 h-52 w-full overflow-hidden rounded-xl bg-gray-50 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]">
          {bounty.token_image_url ? (
            <Image
              src={bounty.token_image_url}
              alt={bounty.title || 'Bounty image'}
              width={340}
              height={208}
              className="h-full w-full object-cover transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <span className="text-sm text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="mt-5">
          <h3 className="truncate text-lg font-semibold tracking-tight">
            {bounty.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {bounty.description}
          </p>
        </div>

        {children}
      </div>
    </Link>
  );
};

export const BountyCard: React.FC<BountyCardProps> = (props) => {
  switch (props.status) {
    case 'submissions':
      return <ActiveBountyCard {...props} />;
    case 'stale':
    case 'voting':
      return <VotingBountyCard {...props} />;
    case 'completed':
    case 'failed':
      return <CompletedBountyCard {...props} />;
    case 'crowdfunding':
      return <CrowdfundingBountyCard {...props} />;
    default:
      return null;
  }
};
