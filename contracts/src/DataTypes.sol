// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

enum CrowdfundingPhase {
    Funding,
    Submission,
    Voting,
    Ended
}

struct Crowdfunding {
    uint256 id;
    address creator;
    address token;
    address winner;
    bool finalized;
    uint256 amountRaised;
    Votes votes;
    uint256 numSubmissions;
    uint256 numFunders;
    uint256 fundingPhaseEnd; // timestamp
    uint256 submissionPhaseEnd; // timestamp
    uint256 votingPhaseEnd; // timestamp
    uint256 raiseCap; // this is optional, 0 means no cap
    uint256 developerFeePercentage; // percentage of total supply tokens to be given to the developer
    mapping(address => uint256) deposits;
    mapping(bytes32 => Submission) submissions;
    bytes32[] submissionIds;
}

struct Votes {
    uint256 numVotes;
    uint256 votesPower; // should be more than X % of total supply of tokens to count
    mapping(address => uint256) hasVoted;
    mapping(bytes32 => uint256) submissionVotes;
}

struct Submission {
    bytes32 id;
    address creator;
    uint256 timestamp;
}

struct CrowdfundingShort {
    uint256 id;
    address creator;
    address token;
    bool finalized;
    address winner;
    uint256 amountRaised;
    uint256 fundingPhaseEnd;
    uint256 submissionPhaseEnd;
    uint256 votingPhaseEnd;
    uint256 raiseCap;
    uint256 developerFeePercentage;
    uint256 numSubmissions;
    uint256 numFunders;
    CrowdfundingPhase phase;
    bytes32[] submissionIds;
}

struct CrowdfundingCreationParams {
    string name;
    string symbol;
    uint256 fundingPhaseEnd;
    uint256 submissionPhaseEnd;
    uint256 votingPhaseEnd;
    uint256 raiseCap;
    uint256 developerFeePercentage;
}

event CrowdfundingFunded(uint256 indexed crowdfundingId, address indexed sender, uint256 amount);

event CrowdfundingCreated(
    uint256 indexed crowdfundingId,
    address indexed creator,
    address indexed tokenAddress,
    uint256 fundingPhaseEnd,
    uint256 submissionPhaseEnd,
    uint256 votingPhaseEnd,
    uint256 raiseCap
);

event SolutionSubmitted(uint256 indexed crowdfundingId, bytes32 indexed submissionId, address indexed creator);

event CrowdfundingFinalized(uint256 indexed crowdfundingId, address indexed winner);

event CrowdfundingFinalizedWithoutWinner(uint256 indexed crowdfundingId);

event Vote(uint256 indexed crowdfundingId, bytes32 indexed submissionId, address indexed voter, uint256 votePower);

event Withdrawal(uint256 indexed crowdfundingId, address indexed sender, uint256 amount);

event DebugPhaseChanged(
    uint256 indexed crowdfundingId, uint256 fundingPhaseEnd, uint256 submissionPhaseEnd, uint256 votingPhaseEnd
);

error CrowdfundingNotFound();
error CrowdfundingNotActive();
error CrowdfundingStillActive();
error CrowdfundingAlreadyFinalized();
error NotWinner();
error InitialFundingRequired();
error InitialFundingExceedsCap(uint256 requested, uint256 cap);
error FundingCapReached(uint256 requested, uint256 cap);

error NotInFundingPhase();
error NotInSubmissionPhase();
error NotInVotingPhase();
error VotesPowerTooLow();

error NoDeposits();
error SolutionAlreadySubmitted(bytes32 submissionId);
error DeveloperFeePercentageTooHigh(uint256 developerFeePercentage);
error RequestedFundingZero();
error VotingBalanceZero();
error AlreadyVoted(bytes32 submissionId);
error CannotVoteForYourOwnSubmission(bytes32 submissionId);
error SubmissionNotFound(bytes32 submissionId);
error FundingPhaseEndMustBeInFuture(uint256 fundingPhaseEnd, uint256 currentTimestamp);
error MinimumFundingPhaseDurationNotMet(uint256 duration, uint256 minDuration);
error MinimumSubmissionPhaseDurationNotMet(uint256 duration, uint256 minDuration);
error MinimumVotingPhaseDurationNotMet(uint256 duration, uint256 minDuration);
error TimestampsNotInCorrectOrder();
