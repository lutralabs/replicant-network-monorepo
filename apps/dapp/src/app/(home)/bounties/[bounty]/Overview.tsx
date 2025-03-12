import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Bounty } from '@/hooks/useGetBounty';
import { bountyStatus } from '@/lib/utils';
import { Trophy } from 'lucide-react';
import React, { useMemo } from 'react';

export const Overview = ({ bounty }: { bounty: Bounty }) => {
  const status = bountyStatus(bounty);

  const winningSubmission = useMemo(() => {
    if (!bounty.submissions || bounty.submissions.length === 0) return null;

    let winner = bounty.submissions[0];
    let maxVotes = winner.votes ? winner.votes.length : 0;

    for (const submission of bounty.submissions) {
      const voteCount = submission.votes ? submission.votes.length : 0;
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winner = submission;
      }
    }

    return winner;
  }, [bounty.submissions]);

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Overview</CardTitle>
          {status === 'completed' && winningSubmission && (
            <div className="mt-2 mb-2 flex flex-col sm:flex-row items-start sm:items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-md">
              <div className="flex items-center mb-2 sm:mb-0">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />
                <span className="text-sm font-medium">Bounty Winner:</span>
              </div>
              <div className="sm:ml-2 break-all">
                <span className="font-medium text-md">{bounty.winner}</span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="px-4 pb-4">
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
