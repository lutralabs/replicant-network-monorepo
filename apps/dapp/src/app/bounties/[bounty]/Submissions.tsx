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
import { useWallets } from '@privy-io/react-auth';
import Link from 'next/link';
import React, { useMemo } from 'react';

export const Submissions = ({
  bounty,
}: {
  bounty: Bounty;
}) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const isUserFunder = useMemo(() => {
    if (!wallet) return false;
    return bounty.funders.some(
      (funder) =>
        funder.funder_id.toLowerCase() === wallet.address.toLowerCase()
    );
  }, [bounty, wallet]);

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
                {model.votes.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {bountyStatus(bounty) === 'voting' && (
        <div className="w-full flex justify-end mt-12">
          {isUserFunder ? (
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
          ) : (
            <div className="text-gray-600">
              You did not participate in this bounty
            </div>
          )}
        </div>
      )}
    </div>
  );
};
