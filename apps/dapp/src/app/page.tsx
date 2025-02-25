import { ArrowUpLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Homepage = async () => {
  return (
    <section className="grid h-full place-content-center">
      <div className="flex flex-col items-center space-y-4 pb-12">
        <h1 className="mt-12 text-4xl font-bold">
          Welcome to Replicant Network!
        </h1>
        <p className="text-center text-lg">
          Replicant Network is a platform for crowdfunding, tokenizing and using
          custom (Fine-Tuned) AI models.
        </p>
        <div className="mt-8 flex w-full gap-x-12 px-24">
          <Link
            className="flex h-[150px] grow flex-col justify-between rounded-md bg-purple-600 p-4 text-2xl text-white hover:opacity-90"
            href="/models"
          >
            <ArrowUpLeft className="h-8 w-8 text-white" />
            <div className="text-end">View Models</div>
          </Link>
          <Link
            className="flex h-[150px] grow flex-col justify-between rounded-md bg-purple-600 p-4 text-2xl text-white hover:opacity-90"
            href="/bounties"
          >
            <ArrowUpLeft className="h-8 w-8 text-white" />
            <div className="text-end">View Bounties</div>
          </Link>
        </div>
        <div className="mt-36 text-3xl font-semibold">How it works:</div>
        <Image
          alt="How it Works"
          height={600}
          src={'/howitworks.png'}
          width={1200}
        />
        <p>
          <span className="text-lg font-medium">1.</span> Create and fund a
          bounty (MON) and mint tokenized model. <br />
          <span className="text-lg font-medium">2.</span> Anybody can contribute
          to the bounty (MON) and mint tokens. <br />
          <span className="text-lg font-medium">3.</span> During the Development
          period, AI Engineers create and submit models.
          <br />
          <span className="text-lg font-medium">4.</span> After the Development
          period, anybody who contributed to the bounty can test all submitted
          models and vote on the best model. <br />
          <span className="text-lg font-medium">5.</span> The best model is
          selected and the bounty (MON) is distributed to the model creator.
          Model creator also gets a % of tokenized model. <br />
          <span className="text-lg font-medium">6.</span> Model is made public
          for anybody to use. List of public models can be found{' '}
          <Link
            className="text-purple-600 underline hover:opacity-90"
            href="/models"
          >
            here{' '}
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Homepage;
