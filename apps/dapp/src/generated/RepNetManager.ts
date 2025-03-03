//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RepNetManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const repNetManagerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_DEVELOPER_FEE_PERCENTAGE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_FUNDING_PHASE_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_SUBMISSION_PHASE_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_PHASE_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_params',
        internalType: 'struct CrowdfundingCreationParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'fundingPhaseEnd', internalType: 'uint256', type: 'uint256' },
          {
            name: 'submissionPhaseEnd',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'votingPhaseEnd', internalType: 'uint256', type: 'uint256' },
          { name: 'raiseCap', internalType: 'uint256', type: 'uint256' },
          {
            name: 'developerFeePercentage',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'createCrowdfunding',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'crowdfundingId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'crowdfundings',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'accepted', internalType: 'bool', type: 'bool' },
      { name: 'amountRaised', internalType: 'uint256', type: 'uint256' },
      { name: 'numSubmissions', internalType: 'uint256', type: 'uint256' },
      { name: 'numFunders', internalType: 'uint256', type: 'uint256' },
      { name: 'fundingPhaseEnd', internalType: 'uint256', type: 'uint256' },
      { name: 'submissionPhaseEnd', internalType: 'uint256', type: 'uint256' },
      { name: 'votingPhaseEnd', internalType: 'uint256', type: 'uint256' },
      { name: 'raiseCap', internalType: 'uint256', type: 'uint256' },
      {
        name: 'developerFeePercentage',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'erc20Factory',
    outputs: [
      { name: '', internalType: 'contract ERC20Factory', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fund',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCrowdfunding',
    outputs: [
      {
        name: '',
        internalType: 'struct CrowdfundingShort',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'accepted', internalType: 'bool', type: 'bool' },
          { name: 'amountRaised', internalType: 'uint256', type: 'uint256' },
          { name: 'fundingPhaseEnd', internalType: 'uint256', type: 'uint256' },
          {
            name: 'submissionPhaseEnd',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'votingPhaseEnd', internalType: 'uint256', type: 'uint256' },
          { name: 'raiseCap', internalType: 'uint256', type: 'uint256' },
          {
            name: 'developerFeePercentage',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCrowdfundingPhase',
    outputs: [
      { name: '', internalType: 'enum CrowdfundingPhase', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTotalFunders',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTotalRaised',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isCrowdfundingActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'crowdfundingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CrowdfundingCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'crowdfundingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Funded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [
      { name: 'crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'CrowdfundingNotFound',
  },
  { type: 'error', inputs: [], name: 'DeveloperFeePercentageTooHigh' },
  { type: 'error', inputs: [], name: 'FundingCapReached' },
  { type: 'error', inputs: [], name: 'FundingPhaseEndMustBeInFuture' },
  { type: 'error', inputs: [], name: 'FundingPhaseEnded' },
  { type: 'error', inputs: [], name: 'FundingZero' },
  { type: 'error', inputs: [], name: 'InitialFundingExceedsCap' },
  { type: 'error', inputs: [], name: 'InitialFundingRequired' },
  { type: 'error', inputs: [], name: 'InvalidTimestamps' },
  { type: 'error', inputs: [], name: 'MinimumFundingPhaseDurationNotMet' },
  { type: 'error', inputs: [], name: 'MinimumSubmissionPhaseDurationNotMet' },
  { type: 'error', inputs: [], name: 'MinimumVotingPhaseDurationNotMet' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'TimestampsNotInCorrectOrder' },
] as const
