import Link from 'next/link';

import { Button } from '@/components/ui/button';

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
    </div>
  );
}
