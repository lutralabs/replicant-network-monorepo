import type { Bounty } from '@/hooks/useGetBounty';
import React from 'react';
import { formatEther } from 'viem';

export const Details = ({ bounty }: { bounty: Bounty }) => {
  return (
    <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-4">
      <div className="text-xl font-medium">Details</div>

      <ul className="w-full text-sm mt-8">
        <li className="flex justify-between border-b-1 hover:bg-purple-50  border-gray-200 p-4">
          <div className="font-medium">Type of Model</div>
          <div className="text-end">Image Generation</div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50  border-gray-200 p-4">
          <div className="font-medium">Requested Base Model</div>
          <div className="text-end">Solar Eclipse</div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Token Address</div>
          <div className="text-end text-purple-600 underline">
            {bounty.token}
          </div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Max Bounty Amount</div>
          <div className="text-end">
            {formatEther(bounty.raiseCap) ?? 'Unlimited'}
          </div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Creator Deposit</div>
          <div className="text-end">
            {formatEther(
              BigInt(
                bounty.funders?.find(
                  (funder) => funder.funder_id === bounty.creator
                )?.amount
              ) ?? BigInt(0)
            )}{' '}
            MON
          </div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Crowdfunding Period</div>
          <div className="text-end">
            {new Date(Number(bounty.fundingPhaseEnd) * 1000).toUTCString()}
          </div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Development Period</div>
          <div className="text-end">
            {new Date(Number(bounty.submissionPhaseEnd) * 1000).toUTCString()}
          </div>
        </li>
        <li className="flex justify-between p-4 hover:bg-purple-50">
          <div className="font-medium">Voting Period</div>
          <div className="text-end">
            {new Date(Number(bounty.votingPhaseEnd) * 1000).toUTCString()}
          </div>
        </li>
      </ul>
    </div>
  );
};
