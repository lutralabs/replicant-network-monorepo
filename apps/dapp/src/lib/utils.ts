import type { BountyCard } from '@/hooks/useGetBounties';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBalance = (balance: string | number | bigint) => {
  return Number(balance) / 10 ** 18;
};

export const bountyStatus = (bounty: BountyCard) => {
  if (bounty.finalized) {
    if (bounty.winner) {
      return 'completed';
    }
    return 'failed';
  }
  if (Date.now() < Number(bounty.fundingPhaseEnd) * 1000) {
    return 'crowdfunding';
  }
  if (Date.now() < Number(bounty.submissionPhaseEnd) * 1000) {
    return 'submissions';
  }
  if (Date.now() < Number(bounty.votingPhaseEnd) * 1000) {
    return 'voting';
  }
  return 'stale';
};

export const getTimeRemaining = (bounty: BountyCard) => {
  let time;
  switch (bountyStatus(bounty)) {
    case 'crowdfunding':
      time = Number(bounty.fundingPhaseEnd);
      break;
    case 'submissions':
      time = Number(bounty.submissionPhaseEnd);
      break;
    case 'voting':
    case 'completed':
    case 'failed':
    case 'stale':
      time = Number(bounty.votingPhaseEnd);
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
