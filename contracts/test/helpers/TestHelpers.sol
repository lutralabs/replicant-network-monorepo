// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../../src/DataTypes.sol";
import {RepNetManager} from "../../src/RepNetManager.sol";
import {Test, console} from "forge-std/Test.sol";

contract TestHelpers is Test {

    // Common addresses
    address public owner;
    address public user1;
    address public user2;
    address public user3;

    // Test constants
    uint256 constant ONE_ETH = 1 ether;
    uint256 constant HALF_ETH = 0.5 ether;
    uint256 constant TWO_ETH = 2 ether;
    uint256 constant THREE_ETH = 3 ether;

    // Time constants
    uint256 constant ONE_DAY = 1 days;
    uint256 constant TWO_DAYS = 2 days;
    uint256 constant THREE_DAYS = 3 days;
    uint256 constant FOUR_DAYS = 4 days;

    // Contract instance
    RepNetManager public repNetManager;

    function setupAddresses() internal {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
    }

    function setupRepNetManager() internal {
        vm.startPrank(owner);
        repNetManager = new RepNetManager();
        vm.stopPrank();
    }

    function createDefaultCrowdfundingParams() internal view returns (CrowdfundingCreationParams memory) {
        string memory name = "Crowdfunding Token";
        string memory symbol = "CF";

        uint256 currentTime = block.timestamp;
        uint256 fundingPhaseEnd = currentTime + TWO_DAYS;
        uint256 submissionPhaseEnd = fundingPhaseEnd + TWO_DAYS;
        uint256 votingPhaseEnd = submissionPhaseEnd + TWO_DAYS;

        uint256 raiseCap = 10 ether;
        uint256 developerFeePercentage = 1000; // 10%

        return CrowdfundingCreationParams({
            name: name,
            symbol: symbol,
            fundingPhaseEnd: fundingPhaseEnd,
            submissionPhaseEnd: submissionPhaseEnd,
            votingPhaseEnd: votingPhaseEnd,
            raiseCap: raiseCap,
            developerFeePercentage: developerFeePercentage
        });
    }

    function createAndFundCrowdfunding(
        address creator,
        uint256 initialFunding
    ) internal returns (uint256 crowdfundingId) {
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();

        vm.deal(creator, initialFunding);
        vm.prank(creator);
        uint256 newCrowdfundingId = repNetManager.createCrowdfunding{value: initialFunding}(params);

        return newCrowdfundingId;
    }

}
