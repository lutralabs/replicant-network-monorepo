//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RepNetManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const repNetManagerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'CONVERSION_RATE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
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
    name: 'MIN_VOTES_POWER_PERCENTAGE',
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
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
      { name: '_phase', internalType: 'enum CrowdfundingPhase', type: 'uint8' },
    ],
    name: '_changePhase',
    outputs: [],
    stateMutability: 'nonpayable',
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
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'finalize',
    outputs: [],
    stateMutability: 'nonpayable',
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
          { name: 'finalized', internalType: 'bool', type: 'bool' },
          { name: 'winner', internalType: 'address', type: 'address' },
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
          { name: 'numSubmissions', internalType: 'uint256', type: 'uint256' },
          { name: 'numFunders', internalType: 'uint256', type: 'uint256' },
          {
            name: 'phase',
            internalType: 'enum CrowdfundingPhase',
            type: 'uint8',
          },
          {
            name: 'submissionIds',
            internalType: 'bytes32[]',
            type: 'bytes32[]',
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
      { name: '_submissionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getSubmission',
    outputs: [
      {
        name: '',
        internalType: 'struct Submission',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'bytes32', type: 'bytes32' },
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
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
    name: 'getSubmissions',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
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
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_creator', internalType: 'address', type: 'address' },
    ],
    name: 'submit',
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
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
      { name: '_submissionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_crowdfundingId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdraw',
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
      {
        name: 'fundingPhaseEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'submissionPhaseEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'votingPhaseEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'raiseCap',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountRaised',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
        indexed: true,
      },
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CrowdfundingFinalized',
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
    ],
    name: 'CrowdfundingFinalizedWithoutWinner',
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
    name: 'CrowdfundingFunded',
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
        name: 'submissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SolutionSubmitted',
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
        name: 'submissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'votePower',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Vote',
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
    name: 'Withdrawal',
  },
  {
    type: 'error',
    inputs: [
      { name: 'submissionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AlreadyVoted',
  },
  {
    type: 'error',
    inputs: [
      { name: 'submissionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'CannotVoteForYourOwnSubmission',
  },
  { type: 'error', inputs: [], name: 'CrowdfundingAlreadyFinalized' },
  { type: 'error', inputs: [], name: 'CrowdfundingNotFound' },
  { type: 'error', inputs: [], name: 'CrowdfundingStillActive' },
  {
    type: 'error',
    inputs: [
      {
        name: 'developerFeePercentage',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'DeveloperFeePercentageTooHigh',
  },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FundingCapReached',
  },
  {
    type: 'error',
    inputs: [
      { name: 'fundingPhaseEnd', internalType: 'uint256', type: 'uint256' },
      { name: 'currentTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FundingPhaseEndMustBeInFuture',
  },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InitialFundingExceedsCap',
  },
  { type: 'error', inputs: [], name: 'InitialFundingRequired' },
  {
    type: 'error',
    inputs: [
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
      { name: 'minDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MinimumFundingPhaseDurationNotMet',
  },
  {
    type: 'error',
    inputs: [
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
      { name: 'minDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MinimumSubmissionPhaseDurationNotMet',
  },
  {
    type: 'error',
    inputs: [
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
      { name: 'minDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MinimumVotingPhaseDurationNotMet',
  },
  { type: 'error', inputs: [], name: 'NoDeposits' },
  { type: 'error', inputs: [], name: 'NotInFundingPhase' },
  { type: 'error', inputs: [], name: 'NotInSubmissionPhase' },
  { type: 'error', inputs: [], name: 'NotInVotingPhase' },
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
  { type: 'error', inputs: [], name: 'RequestedFundingZero' },
  {
    type: 'error',
    inputs: [
      { name: 'submissionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'SolutionAlreadySubmitted',
  },
  {
    type: 'error',
    inputs: [
      { name: 'submissionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'SubmissionNotFound',
  },
  { type: 'error', inputs: [], name: 'TimestampsNotInCorrectOrder' },
  { type: 'error', inputs: [], name: 'VotingBalanceZero' },
] as const
