// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./DataTypes.sol";

import "./ERC20Factory.sol";
import "./ModelTokenERC20.sol";
import "./interfaces/IModelTokenERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RepNetManager is Ownable, ReentrancyGuard {

    uint256 public constant MAX_DEVELOPER_FEE_PERCENTAGE = 5000; // 50%
    uint256 public constant MIN_FUNDING_PHASE_DURATION = 1 days;
    uint256 public constant MIN_SUBMISSION_PHASE_DURATION = 1 days;
    uint256 public constant MIN_VOTING_PHASE_DURATION = 1 days;
    uint256 public constant MIN_VOTES_POWER_PERCENTAGE = 2000; // 20%
    uint256 public constant CONVERSION_RATE = 1_000_000; // 1 eth = 1_000_000 tokens, following the ConstitutionDAO approach
    uint256 public crowdfundingId;
    ERC20Factory public erc20Factory;

    mapping(uint256 => Crowdfunding) private crowdfundings;

    modifier crowdfundingExists(
        uint256 _crowdfundingId
    ) {
        if (!_crowdfundingExists(_crowdfundingId)) {
            revert CrowdfundingNotFound();
        }
        _;
    }

    constructor() Ownable(msg.sender) {
        erc20Factory = new ERC20Factory();
    }

    // publics

    function createCrowdfunding(
        CrowdfundingCreationParams memory _params
    ) public payable nonReentrant {
        if (msg.value == 0) {
            revert InitialFundingRequired();
        }
        if (_params.raiseCap > 0 && msg.value > _params.raiseCap) {
            revert InitialFundingExceedsCap(msg.value, _params.raiseCap);
        }
        if (_params.developerFeePercentage > MAX_DEVELOPER_FEE_PERCENTAGE) {
            revert DeveloperFeePercentageTooHigh(_params.developerFeePercentage);
        }
        _validateTimestamps(_params.fundingPhaseEnd, _params.submissionPhaseEnd, _params.votingPhaseEnd);
        _createCrowdfunding(_params);
        _fund(crowdfundingId - 1);
    }

    function fund(
        uint256 _crowdfundingId
    ) public payable crowdfundingExists(_crowdfundingId) nonReentrant {
        if (_getCurrentPhase(_crowdfundingId) != CrowdfundingPhase.Funding) {
            revert NotInFundingPhase();
        }
        if (
            crowdfundings[_crowdfundingId].raiseCap > 0
                && msg.value > crowdfundings[_crowdfundingId].raiseCap - crowdfundings[_crowdfundingId].amountRaised
        ) {
            revert FundingCapReached(msg.value, crowdfundings[_crowdfundingId].raiseCap);
        }
        if (msg.value == 0) {
            revert RequestedFundingZero();
        }
        _fund(_crowdfundingId);
    }

    function submit(uint256 _crowdfundingId, bytes32 _hash) public crowdfundingExists(_crowdfundingId) onlyOwner {
        if (_getCurrentPhase(_crowdfundingId) != CrowdfundingPhase.Submission) {
            revert NotInSubmissionPhase();
        }
        if (crowdfundings[_crowdfundingId].submissions[_hash].creator != address(0)) {
            revert SolutionAlreadySubmitted(_hash);
        }
        _submit(_crowdfundingId, _hash);
    }

    function vote(
        uint256 _crowdfundingId,
        bytes32 _submissionId
    ) public crowdfundingExists(_crowdfundingId) nonReentrant {
        if (_getCurrentPhase(_crowdfundingId) != CrowdfundingPhase.Voting) {
            revert NotInVotingPhase();
        }
        if (crowdfundings[_crowdfundingId].submissions[_submissionId].creator == address(0)) {
            revert SubmissionNotFound(_submissionId);
        }
        if (crowdfundings[_crowdfundingId].votes.hasVoted[msg.sender] != 0) {
            revert AlreadyVoted(_submissionId);
        }
        if (crowdfundings[_crowdfundingId].submissions[_submissionId].creator == msg.sender) {
            revert CannotVoteForYourOwnSubmission(_submissionId);
        }
        _vote(_crowdfundingId, _submissionId);
    }

    function finalize(
        uint256 _crowdfundingId
    ) public crowdfundingExists(_crowdfundingId) {
        if (_isCrowdfundingActive(_crowdfundingId)) {
            revert CrowdfundingStillActive();
        }
        if (crowdfundings[_crowdfundingId].finalized) {
            revert CrowdfundingAlreadyFinalized();
        }
        _finalize(_crowdfundingId);
        emit CrowdfundingFinalized(_crowdfundingId, crowdfundings[_crowdfundingId].winner);
    }

    function withdraw(
        uint256 _crowdfundingId
    ) public crowdfundingExists(_crowdfundingId) {
        if (_getCurrentPhase(_crowdfundingId) != CrowdfundingPhase.Ended) {
            revert CrowdfundingStillActive();
        }
        if (crowdfundings[_crowdfundingId].finalized && crowdfundings[_crowdfundingId].winner != address(0)) {
            revert CrowdfundingAlreadyFinalized();
        }
        if (crowdfundings[_crowdfundingId].deposits[msg.sender] == 0) {
            revert NoDeposits();
        }
        _withdraw(_crowdfundingId);
    }

    // getters
    function getTotalRaised(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (uint256) {
        return _getTotalRaised(_crowdfundingId);
    }

    function getTotalFunders(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (uint256) {
        return _getTotalFunders(_crowdfundingId);
    }

    function getCrowdfunding(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (CrowdfundingShort memory) {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        return CrowdfundingShort({
            id: cf.id,
            creator: cf.creator,
            token: cf.token,
            finalized: cf.finalized,
            winner: cf.winner,
            amountRaised: cf.amountRaised,
            fundingPhaseEnd: cf.fundingPhaseEnd,
            submissionPhaseEnd: cf.submissionPhaseEnd,
            votingPhaseEnd: cf.votingPhaseEnd,
            raiseCap: cf.raiseCap,
            developerFeePercentage: cf.developerFeePercentage,
            numSubmissions: cf.numSubmissions,
            numFunders: cf.numFunders,
            phase: _getCurrentPhase(_crowdfundingId)
        });
    }

    function getCrowdfundingPhase(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (CrowdfundingPhase) {
        return _getCurrentPhase(_crowdfundingId);
    }

    function isCrowdfundingActive(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (bool) {
        return _isCrowdfundingActive(_crowdfundingId);
    }

    function getSubmissions(
        uint256 _crowdfundingId
    ) public view crowdfundingExists(_crowdfundingId) returns (bytes32[] memory) {
        return crowdfundings[_crowdfundingId].submissionIds;
    }

    function getSubmission(
        uint256 _crowdfundingId,
        bytes32 _submissionId
    ) public view crowdfundingExists(_crowdfundingId) returns (Submission memory) {
        return crowdfundings[_crowdfundingId].submissions[_submissionId];
    }

    // internals

    function _createCrowdfunding(
        CrowdfundingCreationParams memory _params
    ) internal {
        address tokenAddress = _deployERC20(_params.name, _params.symbol);
        Crowdfunding storage cf = crowdfundings[crowdfundingId];
        cf.id = crowdfundingId;
        cf.creator = msg.sender;
        cf.fundingPhaseEnd = _params.fundingPhaseEnd;
        cf.finalized = false;
        cf.numSubmissions = 0;
        cf.winner = address(0);
        cf.submissionPhaseEnd = _params.submissionPhaseEnd;
        cf.votingPhaseEnd = _params.votingPhaseEnd;
        cf.raiseCap = _params.raiseCap;
        cf.developerFeePercentage = _params.developerFeePercentage;
        cf.token = tokenAddress;
        emit CrowdfundingCreated(crowdfundingId, msg.sender, tokenAddress);
        // ok to use since it's not gonna overflow
        unchecked {
            ++crowdfundingId;
        }
    }

    function _fund(
        uint256 _crowdfundingId
    ) internal {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        if (cf.deposits[msg.sender] == 0) {
            cf.numFunders++;
        }
        cf.deposits[msg.sender] += msg.value;
        cf.amountRaised += msg.value;
        // 1 eth should be CONVERSION_RATE tokens
        IModelTokenERC20(cf.token).mint(msg.sender, msg.value * CONVERSION_RATE);
        emit CrowdfundingFunded(_crowdfundingId, msg.sender, msg.value);
    }

    function _submit(uint256 _crowdfundingId, bytes32 _hash) internal {
        crowdfundings[_crowdfundingId].submissionIds.push(_hash);
        crowdfundings[_crowdfundingId].submissions[_hash] =
            Submission({creator: msg.sender, timestamp: block.timestamp, id: _hash});
        crowdfundings[_crowdfundingId].numSubmissions++;
        emit SolutionSubmitted(_crowdfundingId, _hash, msg.sender);
    }

    function _vote(uint256 _crowdfundingId, bytes32 _submissionId) internal {
        uint256 balance = IModelTokenERC20(crowdfundings[_crowdfundingId].token).balanceOf(msg.sender);
        if (balance == 0) {
            revert VotingBalanceZero();
        }
        crowdfundings[_crowdfundingId].votes.voters++;
        crowdfundings[_crowdfundingId].votes.votesPower += balance;
        // next line basically takes a snapshot of the balance at the time of voting
        crowdfundings[_crowdfundingId].votes.hasVoted[msg.sender] = balance;
        crowdfundings[_crowdfundingId].votes.submissionVotes[_submissionId] += balance;
    }

    function _finalize(
        uint256 _crowdfundingId
    ) internal {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        uint256 totalSupply = IModelTokenERC20(cf.token).totalSupply();
        uint256 votesPower = cf.votes.votesPower;

        // check if votes power is at least MIN_VOTES_POWER_PERCENTAGE % of total
        if (votesPower < (totalSupply * MIN_VOTES_POWER_PERCENTAGE) / 10000) {
            cf.finalized = true;
            emit CrowdfundingFinalizedWithoutWinner(_crowdfundingId);
            return;
        }

        // iterate through all sumbissions and find the one with the highest votes power, its creator will be the winner
        uint256 maxVotesPower = 0;
        bytes32 winnerSubmission = bytes32(0);
        for (uint256 i = 0; i < cf.numSubmissions; i++) {
            if (cf.votes.submissionVotes[cf.submissionIds[i]] > maxVotesPower) {
                maxVotesPower = cf.votes.submissionVotes[cf.submissionIds[i]];
                winnerSubmission = cf.submissionIds[i];
            }
        }
        address winner = cf.submissions[winnerSubmission].creator;
        // mint such amount of new tokens to the winner that at the end he will have the developerFee % of the total supply
        uint256 amountToMint = (totalSupply * cf.developerFeePercentage) / (10000 - cf.developerFeePercentage);
        IModelTokenERC20(cf.token).mint(winner, amountToMint);
        cf.winner = cf.submissions[winnerSubmission].creator;
        cf.finalized = true;
        emit CrowdfundingFinalized(_crowdfundingId, cf.winner);
    }

    function _withdraw(
        uint256 _crowdfundingId
    ) internal {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        uint256 amount = cf.deposits[msg.sender];
        cf.deposits[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(_crowdfundingId, msg.sender, amount);
    }

    function _deployERC20(string memory name, string memory symbol) internal returns (address) {
        return erc20Factory.deployERC20(name, symbol);
    }

    function _getTotalFunders(
        uint256 _crowdfundingId
    ) internal view returns (uint256) {
        return crowdfundings[_crowdfundingId].numFunders;
    }

    function _getTotalRaised(
        uint256 _crowdfundingId
    ) internal view returns (uint256) {
        return crowdfundings[_crowdfundingId].amountRaised;
    }

    function _isCrowdfundingActive(
        uint256 _crowdfundingId
    ) internal view returns (bool) {
        return _getCurrentPhase(_crowdfundingId) != CrowdfundingPhase.Ended;
    }

    function _getCurrentPhase(
        uint256 _crowdfundingId
    ) internal view returns (CrowdfundingPhase) {
        Crowdfunding storage cf = crowdfundings[_crowdfundingId];
        if (block.timestamp < cf.fundingPhaseEnd) {
            return CrowdfundingPhase.Funding;
        } else if (block.timestamp < cf.submissionPhaseEnd) {
            return CrowdfundingPhase.Submission;
        } else if (block.timestamp < cf.votingPhaseEnd) {
            return CrowdfundingPhase.Voting;
        } else {
            return CrowdfundingPhase.Ended;
        }
    }

    function _validateTimestamps(
        uint256 fundingPhaseEnd,
        uint256 submissionPhaseEnd,
        uint256 votingPhaseEnd
    ) internal view {
        // Check that timestamps are in the correct order
        if (!(block.timestamp < fundingPhaseEnd)) {
            revert FundingPhaseEndMustBeInFuture(fundingPhaseEnd, block.timestamp);
        }

        if (!(fundingPhaseEnd < submissionPhaseEnd && submissionPhaseEnd < votingPhaseEnd)) {
            revert TimestampsNotInCorrectOrder();
        }

        // Check minimum durations for each phase
        if (fundingPhaseEnd - block.timestamp < MIN_FUNDING_PHASE_DURATION) {
            revert MinimumFundingPhaseDurationNotMet(fundingPhaseEnd - block.timestamp, MIN_FUNDING_PHASE_DURATION);
        }

        if (submissionPhaseEnd - fundingPhaseEnd < MIN_SUBMISSION_PHASE_DURATION) {
            revert MinimumSubmissionPhaseDurationNotMet(
                submissionPhaseEnd - fundingPhaseEnd, MIN_SUBMISSION_PHASE_DURATION
            );
        }

        if (votingPhaseEnd - submissionPhaseEnd < MIN_VOTING_PHASE_DURATION) {
            revert MinimumVotingPhaseDurationNotMet(votingPhaseEnd - submissionPhaseEnd, MIN_VOTING_PHASE_DURATION);
        }
    }

    function _crowdfundingExists(
        uint256 _crowdfundingId
    ) internal view returns (bool) {
        return crowdfundings[_crowdfundingId].creator != address(0);
    }

}
