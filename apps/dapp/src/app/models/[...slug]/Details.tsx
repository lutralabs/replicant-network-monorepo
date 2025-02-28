import type { Bounty } from '@/constants/bounties';
import React from 'react';

export const Details = ({ bounty }: { bounty: Bounty }) => {
  return (
    <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-4">
      <div className="text-xl font-medium">Details</div>

      <ul className="w-full text-sm mt-8">
        <li className="flex justify-between border-b-1 hover:bg-purple-50  border-gray-200 p-4">
          <div className="font-medium">Type of Model</div>
          <div className="text-end">{bounty.type}</div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50  border-gray-200 p-4">
          <div className="font-medium">Requested Base Model</div>
          <div className="text-end">{bounty.baseModel}</div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Token Address</div>
          <div className="text-end text-purple-600 underline">
            {bounty.tokenAddress}
          </div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Max Bounty Amount</div>
          <div className="text-end">{bounty.max ?? 'Unlimited'}</div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Creator Deposit</div>
          <div className="text-end">
            {
              bounty.funders.find(
                (funder) => funder.address === bounty.bountyOwnerAddress
              )?.amount
            }
          </div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Crowdfunding Period</div>
          <div className="text-end">{bounty.crowdfundingPeriod}</div>
        </li>
        <li className="flex justify-between border-b-1 hover:bg-purple-50 border-gray-200 p-4">
          <div className="font-medium">Development Period</div>
          <div className="text-end">{bounty.devPeriod}</div>
        </li>
        <li className="flex justify-between p-4 hover:bg-purple-50">
          <div className="font-medium">Voting Period</div>
          <div className="text-end">{bounty.votingPeriod}</div>
        </li>
      </ul>
    </div>
  );
};
