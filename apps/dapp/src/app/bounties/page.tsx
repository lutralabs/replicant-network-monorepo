'use client';
import Link from 'next/link';

import { BountyCard } from '@/components/BountyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetBounties } from '@/hooks/useGetBounties';
import { bountyStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function Page() {
  const bounties = useGetBounties();
  console.log('BNTs', bounties);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="max-w-[500px]">
          <div className="text-lg font-semibold">Model Bounties</div>
          <div className="text-md mt-2 text-gray-600">
            A list of existing bounties for custom AI models. The bounties go
            through the following phases:
            <ul className="mt-4 text-sm">
              <li className="flex items-center gap-x-2 mt-2">
                <Badge variant="default">Crowdfunding</Badge> Users can join the
                bounty by contributing MON.
              </li>
              <li className="flex items-center gap-x-2 mt-2">
                <Badge variant="blue">Submissions</Badge> Developers can submit
                the models to the bounty.
              </li>
              <li className="flex items-center gap-x-2 mt-2">
                <Badge variant="tertiary">Voting</Badge> Users who participated
                in the crowdfunding can vote for the best model.
              </li>
              <li className="flex items-center gap-x-2 mt-2">
                <Badge variant="secondary">Completed</Badge> The model was
                successfully crowdfunded.
              </li>
              <li className="flex items-center gap-x-2 mt-2">
                <Badge variant="destructive">Failed</Badge> No model satisfied
                the requirements of the bounty.
              </li>
            </ul>
          </div>
        </div>
        <Link href={'/bounties/bounty-form'}>
          <Button variant="cta-solid">Create a Bounty</Button>
        </Link>
      </div>

      <Tabs className="mt-12" defaultValue="active">
        <TabsList className="grid w-[400px] grid-cols-2 bg-white">
          <TabsTrigger value="active">Active Bounties</TabsTrigger>
          <TabsTrigger value="past">Past Bounties</TabsTrigger>
        </TabsList>
        {bounties.isLoading && <div>Loading...</div>}
        {bounties.bounties && bounties.bounties.length > 0 ? (
          <>
            <TabsContent value="active">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {bounties.bounties
                  .filter((bounty) => bounty.finalized === false)
                  .map((bounty) => (
                    <BountyCard
                      key={bounty.id}
                      status={bountyStatus(bounty)}
                      bounty={bounty}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {bounties.bounties
                  .filter((bounty) => bounty.finalized === true)
                  .map((bounty) => (
                    <BountyCard
                      key={bounty.id}
                      status={bountyStatus(bounty)}
                      bounty={bounty}
                    />
                  ))}
              </div>
            </TabsContent>
          </>
        ) : (
          <div>No Bounties yet!</div>
        )}
      </Tabs>
    </div>
  );
}
