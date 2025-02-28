export type Bounty = {
  title: string;
  subtitle: string;
  expectedInputs: string;
  expectedOutput: string;
  type: string;
  baseModel: string;
  tokenAddress: string;
  max: number | undefined;
  funders: { address: string; amount: number }[];
  devPeriod: string;
  crowdfundingPeriod: string;
  votingPeriod: string;
  createdTimestamp: string;
  submittedModels: {
    hash: string;
    author: string;
    votes: number;
    date: string;
  }[];
  winningModel?: string;
  description: string;
  bountyOwnerAddress: string;
  id: string;
  status: 'completed' | 'failed' | 'active' | 'crowdfunding' | 'voting';
  reward: number;
  submissions: number;
  crowdfunders: number;
  timeline: string;
};

export const BOUNTIES: Bounty[] = [
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    subtitle: 'Aj will generate a hella nice crypto logo for u mate.',
    expectedInputs: 'I want image of a logo for my crypto project',
    expectedOutput:
      'A logo image for your crypto project in the style of coolness',
    type: 'Image Generation',
    baseModel: 'ChatGPT',
    tokenAddress: '0x123WhereAmI321',
    max: undefined,
    funders: [
      {
        address: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
        amount: 500,
      },
      {
        address: '0x1845aa12F9CC5691a1Fb7848b113F599714ed201',
        amount: 500,
      },
    ],
    devPeriod: '2 weeks',
    crowdfundingPeriod: '1 week',
    votingPeriod: '1 week',
    createdTimestamp: '1740739374',
    submittedModels: [
      {
        hash: '0x123Where',
        author: 'REDACTED',
        votes: 0,
        date: '1740739374',
      },
    ],
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '1',
    status: 'active' as
      | 'completed'
      | 'failed'
      | 'active'
      | 'crowdfunding'
      | 'voting',
    reward: 1000,
    submissions: 3,
    crowdfunders: 15,
    timeline: '13 days left',
  },
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    subtitle: 'Aj will generate a hella nice crypto logo for u mate.',
    expectedInputs: 'I want image of a logo for my crypto project',
    expectedOutput:
      'A logo image for your crypto project in the style of coolness',
    type: 'Image Generation',
    baseModel: 'ChatGPT',
    tokenAddress: '0x123WhereAmI321',
    max: undefined,
    funders: [
      {
        address: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
        amount: 500,
      },
      {
        address: '0x1845aa12F9CC5691a1Fb7848b113F599714ed201',
        amount: 500,
      },
    ],
    devPeriod: '2 weeks',
    crowdfundingPeriod: '1 week',
    votingPeriod: '1 week',
    createdTimestamp: '1740739374',
    submittedModels: [],
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '2',
    status: 'crowdfunding' as
      | 'completed'
      | 'failed'
      | 'active'
      | 'crowdfunding'
      | 'voting',
    reward: 1500,
    submissions: 0,
    crowdfunders: 15,
    timeline: '4 days left',
  },
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    subtitle: 'Aj will generate a hella nice crypto logo for u mate.',
    expectedInputs: 'I want image of a logo for my crypto project',
    expectedOutput:
      'A logo image for your crypto project in the style of coolness',
    type: 'Image Generation',
    baseModel: 'ChatGPT',
    tokenAddress: '0x123WhereAmI321',
    max: undefined,
    funders: [
      {
        address: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
        amount: 500,
      },
      {
        address: '0x1845aa12F9CC5691a1Fb7848b113F599714ed201',
        amount: 500,
      },
    ],
    devPeriod: '2 weeks',
    crowdfundingPeriod: '1 week',
    votingPeriod: '1 week',
    createdTimestamp: '1740739374',
    submittedModels: [
      {
        hash: '0x123Where',
        author: 'REDACTED',
        votes: 3,
        date: '1740739374',
      },
    ],
    winningModel: '0x123Where',
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '3',
    status: 'completed' as
      | 'completed'
      | 'failed'
      | 'active'
      | 'crowdfunding'
      | 'voting',
    reward: 1500,
    submissions: 4,
    crowdfunders: 15,
    timeline: '13 days ago',
  },
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    subtitle: 'Aj will generate a hella nice crypto logo for u mate.',
    expectedInputs: 'I want image of a logo for my crypto project',
    expectedOutput:
      'A logo image for your crypto project in the style of coolness',
    type: 'Image Generation',
    baseModel: 'ChatGPT',
    tokenAddress: '0x123WhereAmI321',
    max: undefined,
    funders: [
      {
        address: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
        amount: 500,
      },
      {
        address: '0x1845aa12F9CC5691a1Fb7848b113F599714ed201',
        amount: 500,
      },
    ],
    devPeriod: '2 weeks',
    crowdfundingPeriod: '1 week',
    votingPeriod: '1 week',
    createdTimestamp: '1740739374',
    submittedModels: [
      {
        hash: '0x123Where',
        author: 'REDACTED',
        votes: 0,
        date: '1740739374',
      },
    ],
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '4',
    status: 'failed' as
      | 'completed'
      | 'failed'
      | 'active'
      | 'crowdfunding'
      | 'voting',
    reward: 120,
    submissions: 0,
    crowdfunders: 3,
    timeline: '5 days ago',
  },
  {
    title: 'Crypto Logo Generator Crypto Logo Generator',
    subtitle: 'Aj will generate a hella nice crypto logo for u mate.',
    expectedInputs: 'I want image of a logo for my crypto project',
    expectedOutput:
      'A logo image for your crypto project in the style of coolness',
    type: 'Image Generation',
    baseModel: 'ChatGPT',
    tokenAddress: '0x123WhereAmI321',
    max: undefined,
    funders: [
      {
        address: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
        amount: 500,
      },
      {
        address: '0x1845aa12F9CC5691a1Fb7848b113F599714ed201',
        amount: 500,
      },
    ],
    devPeriod: '2 weeks',
    crowdfundingPeriod: '1 week',
    votingPeriod: '1 week',
    createdTimestamp: '1740739374',
    submittedModels: [
      {
        hash: '0x123Where',
        author: 'REDACTED',
        votes: 3,
        date: '1740739374',
      },
    ],
    description:
      'A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects. A model based on ChatGPT that generates images of Logos applicable to crypto projects.',
    bountyOwnerAddress: '0x1845aa12F9CC5691a1Fb7848b063F599714ed201',
    id: '5',
    status: 'voting' as
      | 'completed'
      | 'failed'
      | 'active'
      | 'crowdfunding'
      | 'voting',
    reward: 120,
    submissions: 3,
    crowdfunders: 3,
    timeline: '5 days left',
  },
];
