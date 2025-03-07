import { Button } from '@/components/ui/button';
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
import { bountyStatus } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export const Submissions = ({ bounty }: { bounty: Bounty }) => {
  return (
    <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-4">
      <div className="text-xl font-medium">Submissions</div>

      <Table className="mt-8 ">
        <TableHeader>
          <TableRow>
            <TableHead className="p-4">Model ID</TableHead>
            <TableHead className="p-4">Submission Date</TableHead>
            <TableHead className="p-4">Author</TableHead>
            <TableHead className="p-4">Votes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bounty.submissions.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="p-4 font-medium text-md max-w-[200px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate">{model.id}</div>
                    </TooltipTrigger>
                    <TooltipContent>{model.id}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="p-4 font-medium text-md">
                {new Date(Number(model.timestamp) * 1000).toUTCString()}
              </TableCell>
              <TableCell className="p-4 font-medium text-md">
                {model.creator_id}
              </TableCell>
              <TableCell className="p-4 font-medium text-md">
                {model.totalVotesPower}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {bountyStatus(bounty) === 'voting' && (
        <div className="w-full flex justify-end mt-12">
          <div className="flex gap-x-2">
            <Link href={`/bounties/${bounty.id}/test-models`}>
              <Button variant="cta-solid" size="sm">
                Try Models
              </Button>
            </Link>
            <Link href={`/bounties/${bounty.id}/vote`}>
              <Button variant="cta-solid" size="sm">
                Vote
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
