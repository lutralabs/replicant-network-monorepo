'use client';

import { Crowdfunders } from '@/app/bounties/[bounty]/Crowdfunders';
import { Details } from '@/app/bounties/[bounty]/Details';
import { Overview } from '@/app/bounties/[bounty]/Overview';
import { Submissions } from '@/app/bounties/[bounty]/Submissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BOUNTIES } from '@/constants/bounties';
import { usePathname } from 'next/navigation';
import { BountyInfo } from '@/components/BountyInfo';

export default function Page() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const slug = pathNames[pathNames.length - 1];
  console.log(slug);

  const bounty = BOUNTIES.find((bounty) => bounty.id === slug);

  return (
    <div className="w-full h-full pb-12">
      <BountyInfo bounty={bounty} />
      <Tabs className="mt-8" defaultValue="overview">
        <TabsList className="grid w-[500px] grid-cols-4 bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="crowdfunders">Crowdfunders</TabsTrigger>
          <TabsTrigger
            disabled={bounty.status === 'crowdfunding' && true}
            value="submissions"
          >
            Submissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview bounty={bounty} />
        </TabsContent>
        <TabsContent value="details">
          <Details bounty={bounty} />
        </TabsContent>
        <TabsContent value="crowdfunders">
          <Crowdfunders bounty={bounty} />
        </TabsContent>
        <TabsContent value="submissions">
          <Submissions bounty={bounty} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
