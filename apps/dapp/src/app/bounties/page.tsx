'use client';
import Link from 'next/link';

import { BountyCard } from '@/components/BountyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReadBounties } from '@/hooks/useReadBounties';
import { bountyStatus } from '@/lib/utils';

export default function Page() {
  const bounties = useReadBounties();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="max-w-[500px]">
          <div className="text-lg font-semibold">Model Bounties</div>
          <div className="text-md mt-2 text-gray-600">
            A list of existing bounties for custom AI models. Users are welcome
            to join existing bounties by either contributing MON to the bounty
            or by submitting a Model OR create a new bounty.
          </div>
        </div>
        <Link href={'/bounties/bounty-form'}>
          <Button variant="cta-solid">Create a Bounty</Button>
        </Link>
      </div>

      <Tabs className="mt-12" defaultValue="active">
        <TabsList className="grid w-[400px] grid-cols-3 bg-white">
          <TabsTrigger value="active">Active Bounties</TabsTrigger>
          <TabsTrigger value="crowdfunding">Crowdfunding</TabsTrigger>
          <TabsTrigger value="past">Past Bounties</TabsTrigger>
        </TabsList>
        {bounties.isLoading && <div>Loading...</div>}
        {bounties.bounties && (
          <>
            <TabsContent value="active">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {bounties.bounties
                  .filter(
                    (bounty) =>
                      bountyStatus(bounty) === 'active' ||
                      bountyStatus(bounty) === 'voting'
                  )
                  .map((bounty) => (
                    <BountyCard
                      key={bounty.id}
                      status={bountyStatus(bounty)}
                      bounty={bounty}
                      submissions={0}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="crowdfunding">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {bounties.bounties
                  .filter((bounty) => bountyStatus(bounty) === 'crowdfunding')
                  .map((bounty) => (
                    <BountyCard
                      key={bounty.id}
                      status={bountyStatus(bounty)}
                      bounty={bounty}
                      submissions={0}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {bounties.bounties
                  .filter(
                    (bounty) =>
                      bountyStatus(bounty) === 'completed' ||
                      bountyStatus(bounty) === 'failed'
                  )
                  .map((bounty) => (
                    <BountyCard
                      key={bounty.id}
                      status={bountyStatus(bounty)}
                      bounty={bounty}
                      submissions={0}
                    />
                  ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
