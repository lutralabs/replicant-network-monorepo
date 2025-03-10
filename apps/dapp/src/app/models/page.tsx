import { ModelCard } from '@/components/ModelCard';

export const metadata = {
  title: 'Models',
};

export default function Page() {
  const MODELS = [
    {
      title: 'Crypto Logo Generator Crypto Logo Generator',
      description:
        'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
      bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
      id: '1',
    },
    {
      title: 'Crypto Logo Generator',
      description:
        'A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
      bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
      id: '2',
    },
    {
      title: 'Crypto Logo Generator',
      description:
        'A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
      bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
      id: '3',
    },
    {
      title: 'Crypto Logo Generator',
      description:
        'A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
      bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
      id: '4',
    },
  ];

  return (
    <div className="w-full">
      <div className="w-[500px]">
        <div className="text-lg font-semibold">Models</div>
        <div className="text-md mt-2 text-gray-600">
          A list of comprehensive models developed by global community of Web2
          and Web3 developers through the crowdfunding campaigns.
        </div>
      </div>
      <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
        {MODELS.map((model) => (
          <ModelCard key={model.id} {...model} />
        ))}
      </div>
    </div>
  );
}
