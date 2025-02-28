// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RepNetManager is Ownable {
    uint256 public crowdfundingId;

    // Define enum for crowdfunding phases
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
        uint256 amountRaised;
        uint256 fundingPhaseEnd; // timestamp
        uint256 submissionPhaseEnd; // timestamp
        uint256 votingPhaseEnd; // timestamp
        uint256 raiseCap;
        uint256 developerFeePercentage; // percentage of total supply tokens to be given to the developer
        mapping(bytes32 => Submission) submissions; // model hash => submission
    }

    struct Submission {
        bytes32 id;
        address creator;
        uint256 timestamp;
    }

    mapping(uint256 => Crowdfunding) public crowdfundings;

    // constructor
    constructor() Ownable(msg.sender) {}

    // receive and fallback
    receive() external payable {}
    fallback() external payable {}

    function crowdfundingExists(uint256 _crowdfundingId) public view returns (bool) {
        return _crowdfundingExists(_crowdfundingId);
    }

    function getCurrentPhase(uint256 _crowdfundingId) public view returns (CrowdfundingPhase) {
        return _getCurrentPhase(_crowdfundingId);
    }

    function isCrowdfundingActive(uint256 _crowdfundingId) public view returns (bool) {
        return _isCrowdfundingActive(_crowdfundingId);
    }

    // internals

    function _isCrowdfundingActive(uint256 _crowdfundingId) internal view returns (bool) {
        return _getCurrentPhase(_crowdfundingId) != CrowdfundingPhase.Ended;
    }

    function _getCurrentPhase(uint256 _crowdfundingId) internal view returns (CrowdfundingPhase) {
        require(_crowdfundingExists(_crowdfundingId), "Crowdfunding not found");
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

    function _crowdfundingExists(uint256 _crowdfundingId) internal view returns (bool) {
        return crowdfundings[_crowdfundingId].id != 0;
    }
}
