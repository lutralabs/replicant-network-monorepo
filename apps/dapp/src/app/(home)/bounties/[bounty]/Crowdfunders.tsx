import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Bounty } from '@/hooks/useGetBounty';
import React from 'react';
import { formatEther } from 'viem';

export const Crowdfunders = ({ bounty }: { bounty: Bounty }) => {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-medium">Crowdfunders</h3>
          <span className="text-xs sm:text-sm bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full">
            {bounty.funders.length} total
          </span>
        </div>

        <ScrollArea className="h-[350px] sm:h-[400px] pr-2 sm:pr-4">
          <div className="space-y-1 sm:space-y-2">
            {bounty.funders.map((crowdfunder) => (
              <div
                key={crowdfunder.funder_id}
                className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink overflow-hidden">
                  <div
                    className="font-mono text-xs sm:text-sm text-gray-900 truncate max-w-[120px] sm:max-w-[60%]"
                    title={crowdfunder.funder_id}
                  >
                    {crowdfunder.funder_id}
                  </div>
                </div>
                <div className="text-right font-medium text-sm sm:text-base flex-shrink-0 pl-2">
                  {formatEther(BigInt(crowdfunder.amount))}{' '}
                  <span className="text-gray-500">MON</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
