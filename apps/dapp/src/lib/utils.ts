import type { Bounty } from '@/hooks/useReadBounties';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBalance = (balance: string | number | bigint) => {
  return Number(balance) / 10 ** 18;
};

export const bountyStatus = (bounty: Bounty) => {
  if (bounty.phase === 0) {
    return 'crowdfunding';
  }
  if (bounty.phase === 1) {
    return 'active';
  }
  if (bounty.phase === 2) {
    return 'voting';
  }
  if (bounty.phase === 3) {
    return 'completed';
  }
  if (bounty.phase === 4) {
    return 'failed';
  }
};

export const getTimeRemaining = (bounty: Bounty) => {
  let time;
  switch (bountyStatus(bounty)) {
    case 'crowdfunding':
      time = bounty.fundingPhaseEnd;
      break;
    case 'active':
      time = bounty.submissionPhaseEnd;
      break;
    case 'voting':
    case 'completed':
    case 'failed':
      time = bounty.votingPhaseEnd;
      break;
  }
  const now = new Date();
  // Convert deadline string to milliseconds (assuming it's a Unix timestamp in seconds)
  const deadlineMs = Number.parseInt(time) * 1000;
  const deadlineDate = new Date(deadlineMs);
  const diff = deadlineDate.getTime() - now.getTime(); // Difference in milliseconds

  const isInPast = diff < 0;
  const absDiff = Math.abs(diff);

  // Convert to days and hours
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days > 0) {
    return isInPast
      ? `${days} ${days === 1 ? 'day' : 'days'} ago`
      : `${days} ${days === 1 ? 'day' : 'days'} left`;
  }
  return isInPast
    ? `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    : `${hours} ${hours === 1 ? 'hour' : 'hours'} left`;
};
