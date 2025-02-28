import type { Bounty } from '@/constants/bounties';
import React from 'react';

export const Crowdfunders = ({ bounty }: { bounty: Bounty }) => {
  return (
    <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-4">
      <div className="text-xl font-medium">Crowdfunders</div>

      <ul className="w-full text-sm mt-8">
        {bounty.funders.map((crowdfunder, index) => (
          <li
            key={crowdfunder.address}
            className={`flex justify-between ${index < bounty.funders.length - 1 && 'border-b-1 border-gray-200'} hover:bg-purple-50 p-4`}
          >
            <div className="font-medium">{crowdfunder.address}</div>
            <div className="text-end">
              {crowdfunder.amount} <span className="font-semibold">MON</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
