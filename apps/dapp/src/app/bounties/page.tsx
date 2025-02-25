import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center">
        <div className="max-w-[500px]">
          <div className="text-lg font-semibold">Models</div>
          <div className="text-md text-gray-600">
            A list of comprehensive models developed by global community of Web2
            and Web3 developers through the crowdfunding campaigns.
          </div>
        </div>
        <Link href={'/bounties/bounty-form'}>
          <Button variant="cta-solid">Create a Bounty</Button>
        </Link>
      </div>
    </div>
  );
}
