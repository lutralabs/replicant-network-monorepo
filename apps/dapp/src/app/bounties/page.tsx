'use client';
import Link from 'next/link';

import { BountyCard } from '@/components/BountyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BOUNTIES } from '@/constants/bounties';
import { useReadBounties } from '@/hooks/useReadBounties';

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
                  .filter((bounty) => bounty.phase === 0 || bounty.phase === 4)
                  .map((bounty) => (
                    <BountyCard key={bounty.id} title={bounty} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="crowdfunding">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {bounties.bounties
                  .filter((bounty) => bounty.phase === 1)
                  .map((bounty) => (
                    <BountyCard key={bounty.id} {...bounty} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {bounties.bounties
                  .filter(
                    (bounty) =>
                      bounty.status === 'completed' ||
                      bounty.status === 'failed'
                  )
                  .map((bounty) => (
                    <BountyCard key={bounty.id} {...bounty} />
                  ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
