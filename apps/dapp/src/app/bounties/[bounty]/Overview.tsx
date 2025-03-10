import type { Bounty } from '@/hooks/useGetBounty';
import { bountyStatus } from '@/lib/utils';
import React from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Overview = ({ bounty }: { bounty: Bounty }) => {
  const status = bountyStatus(bounty);

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium">Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {bounty.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
