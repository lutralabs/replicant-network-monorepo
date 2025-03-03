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
    bool accepted;
    uint256 amountRaised;
    uint256 numSubmissions;
    uint256 numFunders;
    uint256 fundingPhaseEnd; // timestamp
    uint256 submissionPhaseEnd; // timestamp
    uint256 votingPhaseEnd; // timestamp
    uint256 raiseCap; // this is optional, 0 means no cap
    uint256 developerFeePercentage; // percentage of total supply tokens to be given to the developer
    mapping(address => uint256) deposits;
    mapping(bytes32 => Submission) submissions; // model hash => submission
}

struct CrowdfundingShort {
    uint256 id;
    address creator;
    address token;
    bool accepted;
    uint256 amountRaised;
    uint256 fundingPhaseEnd;
    uint256 submissionPhaseEnd;
    uint256 votingPhaseEnd;
    uint256 raiseCap;
    uint256 developerFeePercentage;
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

struct Submission {
    bytes32 id;
    address creator;
    uint256 timestamp;
}

event Funded(uint256 crowdfundingId, address indexed sender, uint256 amount);

event CrowdfundingCreated(uint256 indexed crowdfundingId, address indexed creator, address indexed tokenAddress);

error InitialFundingRequired();
error InitialFundingExceedsCap();
error FundingCapReached();
error FundingPhaseEnded();
error SubmissionPhaseEnded();
error VotingPhaseEnded();
error CrowdfundingNotFound(uint256 crowdfundingId);
error InvalidRaiseCap();
error DeveloperFeePercentageTooHigh();
error InvalidTimestamps();
error CrowdfundingNotActive();
error FundingZero();

error FundingPhaseEndMustBeInFuture();
error MinimumFundingPhaseDurationNotMet();
error MinimumSubmissionPhaseDurationNotMet();
error MinimumVotingPhaseDurationNotMet();
error TimestampsNotInCorrectOrder();
