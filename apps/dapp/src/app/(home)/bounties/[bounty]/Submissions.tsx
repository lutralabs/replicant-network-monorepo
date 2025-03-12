import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Eye, VoteIcon } from 'lucide-react';
import React, { useMemo } from 'react';

export const Submissions = ({ bounty }: { bounty: Bounty }) => {
  const winningSubmission = useMemo(() => {
    if (!bounty.finalized) return null;
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
        <CardContent className="p-6 sm:p-12 flex flex-col items-center justify-center text-center">
          <div className="border border-dashed border-gray-300 bg-gray-50 rounded-full p-4 sm:p-6 mb-4">
            <Eye className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
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
        <ScrollArea className="h-[400px] sm:h-[400px] w-full">
          {/* Desktop view (hidden on small screens) */}
          <div className="hidden sm:block">
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
                                {model.id.slice(0, 16)}...
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
          </div>

          {/* Mobile view (visible only on small screens) */}
          <div className="sm:hidden space-y-4 px-1">
            {bounty.submissions.map((model) => {
              const isWinner = winningSubmission?.id === model.id;
              return (
                <div
                  key={model.id}
                  className={`p-4 rounded-lg border ${isWinner ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-500">Model ID:</div>
                    <div className="flex items-center font-medium">
                      <VoteIcon className="mr-1 h-4 w-4" />
                      {model.votes.length}
                    </div>
                  </div>
                  <div className="font-mono text-xs mb-3" title={model.id}>
                    {model.id.slice(0, 16)}...
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Date:</div>
                      <div>
                        {new Date(
                          Number(model.timestamp) * 1000
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Author:</div>
                      <div
                        className="font-mono text-xs truncate"
                        title={model.creator_id}
                      >
                        {model.creator_id}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
