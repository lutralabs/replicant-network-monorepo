import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Bounty } from '@/hooks/useGetBounty';
import { useWallets } from '@privy-io/react-auth';
import { VoteIcon, Eye } from 'lucide-react';
import React, { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Submissions = ({ bounty }: { bounty: Bounty }) => {
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

  if (bounty.submissions.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="border border-dashed border-gray-300 bg-gray-50 rounded-full p-6 mb-4">
            <Eye className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No submissions yet</h3>
          <p className="text-gray-500 max-w-md">
            When developers submit their models to this bounty, they will appear
            here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-medium">Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Model ID</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bounty.submissions.map((model) => {
                const isWinner = winningSubmission?.id === model.id;
                return (
                  <TableRow
                    key={model.id}
                    className={`${isWinner ? 'bg-green-100' : ''} hover:bg-gray-50`}
                  >
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="font-mono truncate max-w-[180px]">
                              {model.id}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{model.id}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        Number(model.timestamp) * 1000
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="font-mono truncate max-w-[180px]">
                              {model.creator_id}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{model.creator_id}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end font-medium">
                        <VoteIcon className="mr-1 h-4 w-4" />
                        {model.votes.length}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
