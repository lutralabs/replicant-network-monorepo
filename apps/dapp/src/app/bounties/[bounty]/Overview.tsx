import type { Bounty } from '@/constants/bounties';
import React from 'react';

export const Overview = ({ bounty }: { bounty: Bounty }) => {
  return (
    <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-4">
      {bounty.status === 'completed' && (
        <div className="flex gap-x-2 items-center mb-12 w-fit p-4 rounded-md text-white bg-green-600">
          <div className="text-xl font-medium">Winning Model: </div>
          <div>{bounty.winningModel}</div>
        </div>
      )}

      <div className="text-xl font-medium">Overview</div>

      <p className="mt-4 text-gray-600">{bounty.description}</p>

      <div className="text-xl font-medium mt-12">Expected Inputs</div>

      <p className="mt-4 text-gray-600">{bounty.expectedInputs}</p>

      <div className="text-xl font-medium mt-12">Expected Outputs</div>

      <p className="mt-4 text-gray-600">{bounty.expectedOutput}</p>
    </div>
  );
};
