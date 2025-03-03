// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";
import "./helpers/TestHelpers.sol";

contract RepNetManager_FundTest is TestHelpers {

    uint256 public crowdfundingId;

    function setUp() public {
        setupAddresses();
        setupRepNetManager();

        // Create a crowdfunding for testing
        crowdfundingId = createAndFundCrowdfunding(owner, ONE_ETH);
    }

    function test_Fund_Success() public {
        // Fund the crowdfunding
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);

        // Verify the funding was successful
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        assertEq(cf.amountRaised, TWO_ETH, "Total amount raised should be 2 ETH");

        // Verify the total funders count
        uint256 totalFunders = repNetManager.getTotalFunders(crowdfundingId);
        assertEq(totalFunders, 2, "Total funders should be 1");
    }

    function test_Fund_MultipleFunders() public {
        // First funder
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);

        // Second funder
        vm.deal(user2, HALF_ETH);
        vm.prank(user2);
        repNetManager.fund{value: HALF_ETH}(crowdfundingId);

        // Verify the funding was successful
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        assertEq(cf.amountRaised, ONE_ETH + ONE_ETH + HALF_ETH, "Total amount raised should be 2.5 ETH");

        // Verify the total funders count
        uint256 totalFunders = repNetManager.getTotalFunders(crowdfundingId);
        assertEq(totalFunders, 3, "Total funders should be 3");
    }

    function test_Fund_SameFunderMultipleTimes() public {
        // First funding
        vm.deal(user1, TWO_ETH);
        vm.startPrank(user1);
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);

        // Second funding from same user
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);
        vm.stopPrank();

        // Verify the funding was successful
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        assertEq(cf.amountRaised, THREE_ETH, "Total amount raised should be 3 ETH");

        // Verify the total funders count
        uint256 totalFunders = repNetManager.getTotalFunders(crowdfundingId);
        assertEq(totalFunders, 2, "Total funders should be 1");
    }

    function test_Fund_ZeroAmount() public {
        // Try to fund with zero amount
        vm.prank(user1);
        vm.expectRevert(FundingZero.selector);
        repNetManager.fund{value: 0}(crowdfundingId);
    }

    function test_Fund_NonExistentCrowdfunding() public {
        // Try to fund a non-existent crowdfunding
        uint256 nonExistentId = 999;

        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(CrowdfundingNotFound.selector, nonExistentId));
        repNetManager.fund{value: ONE_ETH}(nonExistentId);
    }

    function test_Fund_AfterFundingPhaseEnded() public {
        // Advance time to after funding phase
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        // Try to fund after funding phase ended
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        vm.expectRevert(FundingPhaseEnded.selector);
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);
    }

    function test_Fund_ExceedsCap() public {
        // Create a crowdfunding with a low cap
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();
        params.raiseCap = ONE_ETH + HALF_ETH; // 1.5 ETH cap

        vm.deal(owner, ONE_ETH);
        vm.prank(owner);
        repNetManager.createCrowdfunding{value: ONE_ETH}(params);
        uint256 lowCapCrowdfundingId = repNetManager.crowdfundingId() - 1;

        // Try to fund more than the cap allows
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        vm.expectRevert(FundingCapReached.selector);
        repNetManager.fund{value: ONE_ETH}(lowCapCrowdfundingId);

        // Fund exactly up to the cap
        vm.deal(user2, HALF_ETH);
        vm.prank(user2);
        repNetManager.fund{value: HALF_ETH}(lowCapCrowdfundingId);

        // Verify the funding was successful
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(lowCapCrowdfundingId);
        assertEq(cf.amountRaised, params.raiseCap, "Total amount raised should equal the cap");
    }

    function test_Fund_EventEmitted() public {
        // Fund the crowdfunding and check for event
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);

        vm.expectEmit(true, true, false, true);
        emit Funded(crowdfundingId, user1, ONE_ETH);

        repNetManager.fund{value: ONE_ETH}(crowdfundingId);
    }

}
