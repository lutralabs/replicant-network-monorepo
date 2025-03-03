// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./DataTypes.sol";

import "./ERC20Factory.sol";
import "./ModelTokenERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RepNetManager is Ownable, ReentrancyGuard {

    uint256 public constant MAX_DEVELOPER_FEE_PERCENTAGE = 5000; // 50%
    uint256 public constant MIN_FUNDING_PHASE_DURATION = 1 days;
    uint256 public constant MIN_SUBMISSION_PHASE_DURATION = 1 days;
    uint256 public constant MIN_VOTING_PHASE_DURATION = 1 days;
    uint256 public crowdfundingId;
    ERC20Factory public erc20Factory;

    mapping(uint256 => Crowdfunding) public crowdfundings;

    modifier crowdfundingExists(
        uint256 _crowdfundingId
    ) {
        if (!_crowdfundingExists(_crowdfundingId)) {
            revert CrowdfundingNotFound(_crowdfundingId);
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
            revert InitialFundingExceedsCap();
        }
        if (_params.developerFeePercentage > MAX_DEVELOPER_FEE_PERCENTAGE) {
            revert DeveloperFeePercentageTooHigh();
        }
        if (!_validateTimestamps(_params.fundingPhaseEnd, _params.submissionPhaseEnd, _params.votingPhaseEnd)) {
            revert InvalidTimestamps();
        }

        _createCrowdfunding(_params);
    }

    function fund(
        uint256 _crowdfundingId
    ) public payable crowdfundingExists(_crowdfundingId) nonReentrant {
        // TODO: increment +1 for number of users who funded
        if (_getCurrentPhase(_crowdfundingId) != CrowdfundingPhase.Funding) {
            revert FundingPhaseEnded();
        }
        if (
            crowdfundings[_crowdfundingId].raiseCap > 0
                && msg.value > crowdfundings[_crowdfundingId].raiseCap - crowdfundings[_crowdfundingId].amountRaised
        ) {
            revert FundingCapReached();
        }
        if (msg.value == 0) {
            revert FundingZero();
        }
        _fund(_crowdfundingId);
    }

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
            accepted: cf.accepted,
            amountRaised: cf.amountRaised,
            fundingPhaseEnd: cf.fundingPhaseEnd,
            submissionPhaseEnd: cf.submissionPhaseEnd,
            votingPhaseEnd: cf.votingPhaseEnd,
            raiseCap: cf.raiseCap,
            developerFeePercentage: cf.developerFeePercentage
        });
    }

    // TODO: submission function, dont forget to increment +1 for number of submissions

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

    // internals

    function _createCrowdfunding(
        CrowdfundingCreationParams memory _params
    ) internal {
        address tokenAddress = _deployERC20(_params.name, _params.symbol);
        Crowdfunding storage cf = crowdfundings[crowdfundingId];
        cf.id = crowdfundingId;
        cf.creator = msg.sender;
        cf.fundingPhaseEnd = _params.fundingPhaseEnd;
        cf.accepted = false;
        cf.amountRaised = msg.value;
        cf.numFunders = 1;
        cf.numSubmissions = 0;
        cf.deposits[msg.sender] = msg.value;
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
        emit Funded(_crowdfundingId, msg.sender, msg.value);
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
    ) internal view returns (bool) {
        // Check that timestamps are in the correct order
        if (!(block.timestamp < fundingPhaseEnd)) {
            revert FundingPhaseEndMustBeInFuture();
        }

        if (!(fundingPhaseEnd < submissionPhaseEnd && submissionPhaseEnd < votingPhaseEnd)) {
            revert TimestampsNotInCorrectOrder();
        }

        // Check minimum durations for each phase
        if (fundingPhaseEnd - block.timestamp < MIN_FUNDING_PHASE_DURATION) {
            revert MinimumFundingPhaseDurationNotMet();
        }

        if (submissionPhaseEnd - fundingPhaseEnd < MIN_SUBMISSION_PHASE_DURATION) {
            revert MinimumSubmissionPhaseDurationNotMet();
        }

        if (votingPhaseEnd - submissionPhaseEnd < MIN_VOTING_PHASE_DURATION) {
            revert MinimumVotingPhaseDurationNotMet();
        }

        return true;
    }

    function _crowdfundingExists(
        uint256 _crowdfundingId
    ) internal view returns (bool) {
        return crowdfundings[_crowdfundingId].creator != address(0);
    }

}
