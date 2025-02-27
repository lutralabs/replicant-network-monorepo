import Link from 'next/link';

import { BountyCard } from '@/components/BountyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BOUNTIES = [
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '1',
    status: 'active' as 'completed' | 'failed' | 'active' | 'crowdfunding',
    reward: 1000,
    submissions: 3,
    crowdfunders: 15,
    timeline: '13 days left',
  },
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '2',
    status: 'crowdfunding' as
      | 'completed'
      | 'failed'
      | 'active'
      | 'crowdfunding',
    reward: 1500,
    submissions: 0,
    crowdfunders: 15,
    timeline: '4 days left',
  },
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '3',
    status: 'completed' as 'completed' | 'failed' | 'active' | 'crowdfunding',
    reward: 1500,
    submissions: 4,
    crowdfunders: 15,
    timeline: '13 days ago',
  },
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '4',
    status: 'failed' as 'completed' | 'failed' | 'active' | 'crowdfunding',
    reward: 120,
    submissions: 0,
    crowdfunders: 3,
    timeline: '5 days ago',
  },
];

export default function Page() {
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
        <TabsContent value="active">
          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
            {BOUNTIES.filter((bounty) => bounty.status === 'active').map(
              (bounty) => (
                <BountyCard key={bounty.id} {...bounty} />
              )
            )}
          </div>
        </TabsContent>
        <TabsContent value="crowdfunding">
          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
            {BOUNTIES.filter((bounty) => bounty.status === 'crowdfunding').map(
              (bounty) => (
                <BountyCard key={bounty.id} {...bounty} />
              )
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
            {BOUNTIES.filter(
              (bounty) =>
                bounty.status === 'completed' || bounty.status === 'failed'
            ).map((bounty) => (
              <BountyCard key={bounty.id} {...bounty} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
