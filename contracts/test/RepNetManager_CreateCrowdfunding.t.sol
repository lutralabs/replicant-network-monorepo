// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";
import "./helpers/TestHelpers.sol";

import {IModelTokenERC20} from "../src/interfaces/IModelTokenERC20.sol";

contract RepNetManager_CreateCrowdfundingTest is TestHelpers {

    function setUp() public {
        setupAddresses();
        setupRepNetManager();
    }

    function test_CreateCrowdfunding_Success() public {
        // Set up test parameters
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();

        // Execute the function with initial funding
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);

        vm.expectEmit(true, true, false, false);
        emit CrowdfundingCreated(
            0,
            user1,
            address(0),
            params.fundingPhaseEnd,
            params.submissionPhaseEnd,
            params.votingPhaseEnd,
            params.raiseCap
        );

        uint256 crowdfundingId = repNetManager.createCrowdfunding{value: ONE_ETH}(params);

        // Verify the returned ID is correct
        assertEq(crowdfundingId, 0, "Returned crowdfunding ID should be 0");

        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);

        assertEq(cf.id, 0, "Crowdfunding ID should be 0");
        assertEq(cf.creator, user1, "Creator should be user1");
        assertEq(cf.amountRaised, ONE_ETH, "Initial amount raised should be 1 ETH");
        assertEq(cf.fundingPhaseEnd, params.fundingPhaseEnd, "Funding phase end should match");
        assertEq(cf.submissionPhaseEnd, params.submissionPhaseEnd, "Submission phase end should match");
        assertEq(cf.votingPhaseEnd, params.votingPhaseEnd, "Voting phase end should match");
        assertEq(cf.raiseCap, params.raiseCap, "Raise cap should match");
        assertEq(cf.developerFeePercentage, params.developerFeePercentage, "Developer fee percentage should match");
        assertEq(cf.finalized, false, "Crowdfunding should not be accepted initially");

        // verify the token balance of the creator user
        assertEq(IModelTokenERC20(cf.token).balanceOf(user1), 1_000_000 ether, "Creator should have 1M tokens");

        // Verify the crowdfunding phase
        CrowdfundingPhase phase = repNetManager.getCrowdfundingPhase(crowdfundingId);
        assertEq(uint256(phase), uint256(CrowdfundingPhase.Funding), "Initial phase should be Funding");

        // Verify the total raised
        uint256 totalRaised = repNetManager.getTotalRaised(crowdfundingId);
        assertEq(totalRaised, ONE_ETH, "Total raised should be 1 ETH");

        // Verify the total funders
        uint256 totalFunders = repNetManager.getTotalFunders(crowdfundingId);
        assertEq(totalFunders, 1, "Total funders should be 1");
    }

    function test_CreateCrowdfunding_ZeroInitialFunding() public {
        // Set up test parameters
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();

        // Execute the function with zero initial funding (should revert)
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        vm.expectRevert(InitialFundingRequired.selector);
        repNetManager.createCrowdfunding{value: 0}(params);
    }

    function test_CreateCrowdfunding_ExceedsCap() public {
        // Set up test parameters with a low cap
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();
        params.raiseCap = 1 ether; // Set a low cap

        // Execute the function with initial funding exceeding cap
        vm.deal(user1, TWO_ETH);
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(InitialFundingExceedsCap.selector, TWO_ETH, params.raiseCap));
        repNetManager.createCrowdfunding{value: TWO_ETH}(params);
    }

    function test_CreateCrowdfunding_DeveloperFeeTooHigh() public {
        // Set up test parameters with high developer fee
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();
        params.developerFeePercentage = 5100; // 60%, exceeds the 50% max

        // Execute the function with developer fee too high
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(DeveloperFeePercentageTooHigh.selector, params.developerFeePercentage));
        repNetManager.createCrowdfunding{value: ONE_ETH}(params);
    }

    function test_CreateCrowdfunding_InvalidTimestamps() public {
        // TODO: unskip when constants in contract will be updated
        vm.skip(true);
        // Set up test parameters with invalid timestamps
        string memory name = "Test Token";
        string memory symbol = "TEST";

        uint256 currentTime = block.timestamp;

        // Test case 1: Funding phase end in the past
        vm.warp(currentTime + 100); // Ensure we have room to set a timestamp in the past
        uint256 fundingPhaseEnd = currentTime; // In the past
        uint256 submissionPhaseEnd = fundingPhaseEnd + TWO_DAYS;
        uint256 votingPhaseEnd = submissionPhaseEnd + TWO_DAYS;

        CrowdfundingCreationParams memory params1 = CrowdfundingCreationParams({
            name: name,
            symbol: symbol,
            fundingPhaseEnd: fundingPhaseEnd,
            submissionPhaseEnd: submissionPhaseEnd,
            votingPhaseEnd: votingPhaseEnd,
            raiseCap: 10 ether,
            developerFeePercentage: 1000
        });

        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(FundingPhaseEndMustBeInFuture.selector, fundingPhaseEnd, currentTime + 100)
        );
        repNetManager.createCrowdfunding{value: ONE_ETH}(params1);

        // Test case 2: Phases in wrong order
        fundingPhaseEnd = block.timestamp + TWO_DAYS;
        submissionPhaseEnd = fundingPhaseEnd - ONE_DAY; // Before funding phase
        votingPhaseEnd = submissionPhaseEnd + TWO_DAYS;

        CrowdfundingCreationParams memory params2 = CrowdfundingCreationParams({
            name: name,
            symbol: symbol,
            fundingPhaseEnd: fundingPhaseEnd,
            submissionPhaseEnd: submissionPhaseEnd,
            votingPhaseEnd: votingPhaseEnd,
            raiseCap: 10 ether,
            developerFeePercentage: 1000
        });

        vm.prank(user1);
        vm.expectRevert(TimestampsNotInCorrectOrder.selector);
        repNetManager.createCrowdfunding{value: ONE_ETH}(params2);

        // Test case 3: Funding phase too short
        fundingPhaseEnd = block.timestamp + 12 hours; // Less than 1 day
        submissionPhaseEnd = fundingPhaseEnd + TWO_DAYS;
        votingPhaseEnd = submissionPhaseEnd + TWO_DAYS;

        CrowdfundingCreationParams memory params3 = CrowdfundingCreationParams({
            name: name,
            symbol: symbol,
            fundingPhaseEnd: fundingPhaseEnd,
            submissionPhaseEnd: submissionPhaseEnd,
            votingPhaseEnd: votingPhaseEnd,
            raiseCap: 10 ether,
            developerFeePercentage: 1000
        });

        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                MinimumFundingPhaseDurationNotMet.selector,
                fundingPhaseEnd - block.timestamp,
                repNetManager.MIN_FUNDING_PHASE_DURATION()
            )
        );
        repNetManager.createCrowdfunding{value: ONE_ETH}(params3);
    }

    function test_CreateCrowdfunding_NoRaiseCap() public {
        // Set up test parameters with no raise cap (0)
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();
        params.raiseCap = 0; // No cap

        // Execute the function with a large initial funding
        vm.deal(user1, TWO_ETH);
        vm.prank(user1);
        uint256 crowdfundingId = repNetManager.createCrowdfunding{value: TWO_ETH}(params);

        // Verify the crowdfunding was created correctly
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);

        assertEq(cf.amountRaised, TWO_ETH, "Initial amount raised should be 2 ETH");
        assertEq(cf.raiseCap, 0, "Raise cap should be 0 (no cap)");
    }

    function test_CreateCrowdfunding_EventEmitted() public {
        // Set up test parameters
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();

        // Execute the function and check for event
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);

        vm.expectEmit(true, true, false, false);
        emit CrowdfundingCreated(
            0,
            user1,
            address(0),
            params.fundingPhaseEnd,
            params.submissionPhaseEnd,
            params.votingPhaseEnd,
            params.raiseCap
        );

        uint256 crowdfundingId = repNetManager.createCrowdfunding{value: ONE_ETH}(params);
        assertEq(crowdfundingId, 0, "Returned crowdfunding ID should be 0");
    }

    function test_CreateCrowdfunding_Success_MultipleCrowdfundings() public {
        // Set up test parameters
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();

        // Execute the function with initial funding
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);

        vm.expectEmit(true, true, false, false);
        emit CrowdfundingCreated(
            0,
            user1,
            address(0),
            params.fundingPhaseEnd,
            params.submissionPhaseEnd,
            params.votingPhaseEnd,
            params.raiseCap
        );

        uint256 firstCrowdfundingId = repNetManager.createCrowdfunding{value: ONE_ETH}(params);

        // Verify the crowdfunding was created correctly
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(firstCrowdfundingId);
        assertEq(cf.id, 0, "Crowdfunding ID should be 0");
        assertEq(firstCrowdfundingId, 0, "Returned crowdfunding ID should be 0");

        // Execute the function again with a different crowdfunding ID
        vm.deal(user2, ONE_ETH);
        vm.prank(user2);

        vm.expectEmit(true, true, false, false);
        emit CrowdfundingCreated(
            1,
            user2,
            address(0),
            params.fundingPhaseEnd,
            params.submissionPhaseEnd,
            params.votingPhaseEnd,
            params.raiseCap
        );

        uint256 secondCrowdfundingId = repNetManager.createCrowdfunding{value: ONE_ETH}(params);

        // Verify the crowdfunding was created correctly
        CrowdfundingShort memory cf2 = repNetManager.getCrowdfunding(secondCrowdfundingId);
        assertEq(cf2.id, 1, "Crowdfunding ID should be 1");
        assertEq(secondCrowdfundingId, 1, "Returned crowdfunding ID should be 1");
    }

}
