import { BountyForm } from './BountyForm';

export const metadata = {
  title: 'Create a Bounty',
};

export default function Page() {
  return (
    <div className="w-full">
      <BountyForm />
    </div>
  );
}
