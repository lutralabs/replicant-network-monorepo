// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";
import "../src/RepNetManager.sol";

import {IModelTokenERC20} from "../src/interfaces/IModelTokenERC20.sol";
import "./helpers/TestHelpers.sol";

contract RepNetManagerRealLifeTest is TestHelpers {

    // Define 25 users for testing
    address[25] public users;

    // Define multiple crowdfundings
    uint256 public crowdfundingInFundingPhase;
    uint256 public crowdfundingInSubmissionPhase;
    uint256 public crowdfundingInVotingPhase;
    uint256 public crowdfundingEndedWithWinner;
    uint256 public crowdfundingEndedWithoutWinner;
    uint256 public crowdfundingWithLowVotePower;

    // Define submission IDs
    bytes32 public submissionId1;
    bytes32 public submissionId2;
    bytes32 public submissionId3;

    // Define funding amounts
    uint256 constant SMALL_FUNDING = 0.1 ether;
    uint256 constant MEDIUM_FUNDING = 0.5 ether;
    uint256 constant LARGE_FUNDING = 1 ether;

    // Other constants
    uint256 public constant CONVERSION_RATE = 1_000_000;
    uint256 public constant MAX_DEVELOPER_FEE_PERCENTAGE = 5000; // 50%
    uint256 public constant MIN_FUNDING_PHASE_DURATION = 1 days;
    uint256 public constant MIN_SUBMISSION_PHASE_DURATION = 1 days;
    uint256 public constant MIN_VOTING_PHASE_DURATION = 1 days;

    // Base time for tests
    uint256 public baseTime;

    function setUp() public {
        setupAddresses();
        setupRepNetManager();

        // Initialize 25 users
        for (uint256 i = 0; i < 25; i++) {
            users[i] = makeAddr(string(abi.encodePacked("user", i)));
        }

        // Set base time
        baseTime = block.timestamp;

        // Set up different crowdfundings in different phases
        setupCrowdfundings();
    }

    function setupCrowdfundings() internal {
        // Set up base durations
        uint256 fundingDuration = 2 days;
        uint256 submissionDuration = 2 days;
        uint256 votingDuration = 2 days;

        // 1. Create crowdfunding in funding phase (current time + future end times)
        crowdfundingInFundingPhase = createCrowdfundingWithCustomTimestamps(
            owner,
            ONE_ETH,
            baseTime,
            baseTime + fundingDuration, // Funding ends in the future
            baseTime + fundingDuration + submissionDuration,
            baseTime + fundingDuration + submissionDuration + votingDuration
        );
        fundCrowdfundingWithMultipleUsers(crowdfundingInFundingPhase, 0, 10);

        // 2. Create crowdfunding in submission phase
        uint256 submissionBaseTime = baseTime - fundingDuration - 1; // Set time so funding phase has ended
        crowdfundingInSubmissionPhase = createCrowdfundingWithCustomTimestamps(
            owner,
            ONE_ETH,
            submissionBaseTime,
            submissionBaseTime + fundingDuration, // Funding already ended
            submissionBaseTime + fundingDuration + submissionDuration, // Submission ends in the future
            submissionBaseTime + fundingDuration + submissionDuration + votingDuration
        );
        fundCrowdfundingWithMultipleUsers(crowdfundingInSubmissionPhase, 5, 15);

        // 3. Create crowdfunding in voting phase
        uint256 votingBaseTime = baseTime - fundingDuration - submissionDuration - 1; // Set time so submission phase has ended
        crowdfundingInVotingPhase = createCrowdfundingWithCustomTimestamps(
            owner,
            ONE_ETH,
            votingBaseTime,
            votingBaseTime + fundingDuration, // Funding already ended
            votingBaseTime + fundingDuration + submissionDuration, // Submission already ended
            votingBaseTime + fundingDuration + submissionDuration + votingDuration // Voting ends in the future
        );
        fundCrowdfundingWithMultipleUsers(crowdfundingInVotingPhase, 10, 20);

        // Submit solutions for voting phase crowdfunding
        vm.warp(votingBaseTime + fundingDuration + 1); // During submission phase
        submissionId1 = keccak256("solution1");
        vm.prank(owner);
        repNetManager.submit(crowdfundingInVotingPhase, submissionId1, users[10]);

        submissionId2 = keccak256("solution2");
        vm.prank(owner);
        repNetManager.submit(crowdfundingInVotingPhase, submissionId2, users[11]);

        // 4. Create crowdfunding ended with winner
        uint256 endedWithWinnerBaseTime = baseTime - fundingDuration - submissionDuration - votingDuration - 1; // Set time so all phases have ended
        crowdfundingEndedWithWinner = createCrowdfundingWithCustomTimestamps(
            owner,
            ONE_ETH,
            endedWithWinnerBaseTime,
            endedWithWinnerBaseTime + fundingDuration, // Funding already ended
            endedWithWinnerBaseTime + fundingDuration + submissionDuration, // Submission already ended
            endedWithWinnerBaseTime + fundingDuration + submissionDuration + votingDuration // Voting already ended
        );
        fundCrowdfundingWithMultipleUsers(crowdfundingEndedWithWinner, 15, 25);

        // Submit solution during submission phase
        vm.warp(endedWithWinnerBaseTime + fundingDuration + 1);
        submissionId3 = keccak256("solution3");
        vm.prank(owner);
        repNetManager.submit(crowdfundingEndedWithWinner, submissionId3, users[15]);

        // Cast votes during voting phase
        vm.warp(endedWithWinnerBaseTime + fundingDuration + submissionDuration + 1);
        for (uint256 i = 16; i < 25; i++) {
            vm.prank(users[i]);
            repNetManager.vote(crowdfundingEndedWithWinner, submissionId3);
        }

        // Finalize after voting phase
        vm.warp(endedWithWinnerBaseTime + fundingDuration + submissionDuration + votingDuration + 1);
        repNetManager.finalize(crowdfundingEndedWithWinner);

        // 5. Create crowdfunding ended without winner (no submissions)
        uint256 endedWithoutWinnerBaseTime = baseTime - fundingDuration - submissionDuration - votingDuration - 1; // Set time so all phases have ended
        crowdfundingEndedWithoutWinner = createCrowdfundingWithCustomTimestamps(
            owner,
            ONE_ETH,
            endedWithoutWinnerBaseTime,
            endedWithoutWinnerBaseTime + fundingDuration, // Funding already ended
            endedWithoutWinnerBaseTime + fundingDuration + submissionDuration, // Submission already ended
            endedWithoutWinnerBaseTime + fundingDuration + submissionDuration + votingDuration // Voting already ended
        );
        fundCrowdfundingWithMultipleUsers(crowdfundingEndedWithoutWinner, 0, 5);

        // Finalize after voting phase
        vm.warp(endedWithoutWinnerBaseTime + fundingDuration + submissionDuration + votingDuration + 1);
        repNetManager.finalize(crowdfundingEndedWithoutWinner);

        // 6. Create crowdfunding with low vote power
        uint256 lowVotePowerBaseTime = baseTime - fundingDuration - submissionDuration - votingDuration - 1; // Set time so all phases have ended
        crowdfundingWithLowVotePower = createCrowdfundingWithCustomTimestamps(
            owner,
            ONE_ETH,
            lowVotePowerBaseTime,
            lowVotePowerBaseTime + fundingDuration, // Funding already ended
            lowVotePowerBaseTime + fundingDuration + submissionDuration, // Submission already ended
            lowVotePowerBaseTime + fundingDuration + submissionDuration + votingDuration // Voting already ended
        );
        fundCrowdfundingWithMultipleUsers(crowdfundingWithLowVotePower, 20, 23);

        // Submit solution during submission phase
        vm.warp(lowVotePowerBaseTime + fundingDuration + 1);
        bytes32 submissionId4 = keccak256("solution4");
        vm.prank(owner);
        repNetManager.submit(crowdfundingWithLowVotePower, submissionId4, users[20]);

        // Only one user votes during voting phase (not enough voting power)
        vm.warp(lowVotePowerBaseTime + fundingDuration + submissionDuration + 1);
        vm.prank(users[21]);
        repNetManager.vote(crowdfundingWithLowVotePower, submissionId4);

        // Finalize after voting phase
        vm.warp(lowVotePowerBaseTime + fundingDuration + submissionDuration + votingDuration + 1);
        repNetManager.finalize(crowdfundingWithLowVotePower);

        // Reset time to base time for tests
        vm.warp(baseTime);
    }

    function createCrowdfundingWithCustomTimestamps(
        address _creator,
        uint256 _initialFunding,
        uint256 _currentTime,
        uint256 _fundingPhaseEnd,
        uint256 _submissionPhaseEnd,
        uint256 _votingPhaseEnd
    ) internal returns (uint256) {
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();

        // Override the timestamps
        params.fundingPhaseEnd = _fundingPhaseEnd;
        params.submissionPhaseEnd = _submissionPhaseEnd;
        params.votingPhaseEnd = _votingPhaseEnd;

        vm.warp(_currentTime); // Set the current time
        vm.deal(_creator, _initialFunding);
        vm.prank(_creator);
        uint256 crowdfundingId = repNetManager.createCrowdfunding{value: _initialFunding}(params);

        return crowdfundingId;
    }

    function fundCrowdfundingWithMultipleUsers(
        uint256 _crowdfundingId,
        uint256 _startUserIndex,
        uint256 _endUserIndex
    ) internal {
        for (uint256 i = _startUserIndex; i < _endUserIndex; i++) {
            uint256 fundingAmount;

            // Vary funding amounts
            if (i % 3 == 0) {
                fundingAmount = SMALL_FUNDING;
            } else if (i % 3 == 1) {
                fundingAmount = MEDIUM_FUNDING;
            } else {
                fundingAmount = LARGE_FUNDING;
            }

            vm.deal(users[i], fundingAmount);
            vm.prank(users[i]);
            repNetManager.fund{value: fundingAmount}(_crowdfundingId);
        }
    }

    function test_RealLifeScenario() public {
        // Verify crowdfunding phases
        assertEq(
            uint256(repNetManager.getCrowdfundingPhase(crowdfundingInFundingPhase)),
            uint256(CrowdfundingPhase.Funding),
            "Should be in funding phase"
        );
        assertEq(
            uint256(repNetManager.getCrowdfundingPhase(crowdfundingInSubmissionPhase)),
            uint256(CrowdfundingPhase.Submission),
            "Should be in submission phase"
        );
        assertEq(
            uint256(repNetManager.getCrowdfundingPhase(crowdfundingInVotingPhase)),
            uint256(CrowdfundingPhase.Voting),
            "Should be in voting phase"
        );
        assertEq(
            uint256(repNetManager.getCrowdfundingPhase(crowdfundingEndedWithWinner)),
            uint256(CrowdfundingPhase.Ended),
            "Should be in ended phase"
        );
        assertEq(
            uint256(repNetManager.getCrowdfundingPhase(crowdfundingEndedWithoutWinner)),
            uint256(CrowdfundingPhase.Ended),
            "Should be in ended phase"
        );
        assertEq(
            uint256(repNetManager.getCrowdfundingPhase(crowdfundingWithLowVotePower)),
            uint256(CrowdfundingPhase.Ended),
            "Should be in ended phase"
        );

        // Verify crowdfunding with winner
        CrowdfundingShort memory cfWithWinner = repNetManager.getCrowdfunding(crowdfundingEndedWithWinner);
        assertTrue(cfWithWinner.finalized, "Should be finalized");
        assertEq(cfWithWinner.winner, users[15], "Winner should be user15");

        // Verify crowdfunding without winner
        CrowdfundingShort memory cfWithoutWinner = repNetManager.getCrowdfunding(crowdfundingEndedWithoutWinner);
        assertTrue(cfWithoutWinner.finalized, "Should be finalized");
        assertEq(cfWithoutWinner.winner, address(0), "Winner should be address(0)");

        // Verify crowdfunding with low vote power
        CrowdfundingShort memory cfLowVotePower = repNetManager.getCrowdfunding(crowdfundingWithLowVotePower);
        assertTrue(cfLowVotePower.finalized, "Should be finalized");
        assertEq(cfLowVotePower.winner, address(0), "Winner should be address(0) due to low vote power");

        // Test additional funding in funding phase
        vm.deal(users[24], ONE_ETH);
        vm.prank(users[24]);
        repNetManager.fund{value: ONE_ETH}(crowdfundingInFundingPhase);

        // Test additional submissions in submission phase
        bytes32 newSubmissionId = keccak256("newSolution");
        vm.prank(owner);
        repNetManager.submit(crowdfundingInSubmissionPhase, newSubmissionId, users[5]);

        // Test additional votes in voting phase
        for (uint256 i = 12; i < 15; i++) {
            vm.prank(users[i]);
            repNetManager.vote(crowdfundingInVotingPhase, submissionId1);
        }

        for (uint256 i = 15; i < 18; i++) {
            vm.prank(users[i]);
            repNetManager.vote(crowdfundingInVotingPhase, submissionId2);
        }

        // Test withdrawal from crowdfunding without winner
        for (uint256 i = 0; i < 5; i++) {
            uint256 balanceBefore = users[i].balance;

            vm.prank(users[i]);
            repNetManager.withdraw(crowdfundingEndedWithoutWinner);

            // Verify balance increased
            assertTrue(users[i].balance > balanceBefore, "Balance should have increased after withdrawal");
        }

        // Test withdrawal from crowdfunding with low vote power
        for (uint256 i = 20; i < 23; i++) {
            uint256 balanceBefore = users[i].balance;

            vm.prank(users[i]);
            repNetManager.withdraw(crowdfundingWithLowVotePower);

            // Verify balance increased
            assertTrue(users[i].balance > balanceBefore, "Balance should have increased after withdrawal");
        }

        // Test failed withdrawal from crowdfunding with winner
        vm.prank(users[16]);
        vm.expectRevert(CrowdfundingAlreadyFinalized.selector);
        repNetManager.withdraw(crowdfundingEndedWithWinner);

        // Test token balances
        address tokenAddress = repNetManager.getCrowdfunding(crowdfundingEndedWithWinner).token;
        IModelTokenERC20 token = IModelTokenERC20(tokenAddress);

        // Winner should have developer fee tokens
        assertTrue(token.balanceOf(users[15]) > 0, "Winner should have tokens from developer fee");

        // Funders should have tokens proportional to their funding
        for (uint256 i = 16; i < 25; i++) {
            uint256 fundingAmount;
            if (i % 3 == 0) {
                fundingAmount = SMALL_FUNDING;
            } else if (i % 3 == 1) {
                fundingAmount = MEDIUM_FUNDING;
            } else {
                fundingAmount = LARGE_FUNDING;
            }

            assertEq(
                token.balanceOf(users[i]), fundingAmount * CONVERSION_RATE, "Token balance should match funding amount"
            );
        }
    }

    function test_CompleteLifecycle() public {
        // Create a new crowdfunding for a complete lifecycle test
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();
        vm.deal(users[0], ONE_ETH);
        vm.prank(users[0]);
        uint256 newCrowdfundingId = repNetManager.createCrowdfunding{value: ONE_ETH}(params);

        // Fund with multiple users in funding phase
        for (uint256 i = 1; i < 10; i++) {
            uint256 fundingAmount = MEDIUM_FUNDING;
            vm.deal(users[i], fundingAmount);
            vm.prank(users[i]);
            repNetManager.fund{value: fundingAmount}(newCrowdfundingId);
        }

        // Move to submission phase
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(newCrowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        // Submit multiple solutions
        bytes32[] memory submissionIds = new bytes32[](3);
        for (uint256 i = 0; i < 3; i++) {
            submissionIds[i] = keccak256(abi.encodePacked("lifecycle_solution", i));
            vm.prank(owner);
            repNetManager.submit(newCrowdfundingId, submissionIds[i], users[i]);
        }

        // Move to voting phase
        vm.warp(cf.submissionPhaseEnd + 1);

        // Cast votes with different distribution
        // Solution 0: 3 votes
        for (uint256 i = 3; i < 6; i++) {
            vm.prank(users[i]);
            repNetManager.vote(newCrowdfundingId, submissionIds[0]);
        }

        // Solution 1: 2 votes
        for (uint256 i = 6; i < 8; i++) {
            vm.prank(users[i]);
            repNetManager.vote(newCrowdfundingId, submissionIds[1]);
        }

        // Solution 2: 1 vote
        vm.prank(users[8]);
        repNetManager.vote(newCrowdfundingId, submissionIds[2]);

        // Move to ended phase
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize
        repNetManager.finalize(newCrowdfundingId);

        // Verify the winner is the creator of solution 0
        cf = repNetManager.getCrowdfunding(newCrowdfundingId);
        assertTrue(cf.finalized, "Should be finalized");
        assertEq(cf.winner, users[0], "Winner should be user0 (creator of solution with most votes)");

        // Verify token balances
        address tokenAddress = cf.token;
        IModelTokenERC20 token = IModelTokenERC20(tokenAddress);

        // Winner should have developer fee tokens
        uint256 winnerBalance = token.balanceOf(users[0]);
        uint256 totalSupply = token.totalSupply();
        uint256 expectedDevFeePercentage = params.developerFeePercentage;

        // Calculate expected winner balance: initial funding tokens + dev fee
        uint256 initialFundingTokens = ONE_ETH * CONVERSION_RATE;
        uint256 expectedWinnerBalance = initialFundingTokens
            + ((totalSupply - winnerBalance) * expectedDevFeePercentage) / (10000 - expectedDevFeePercentage);

        // 10e16 is basically 10%
        assertApproxEqRel(winnerBalance, expectedWinnerBalance, 10e16, "Winner balance should include developer fee");

        // Try to withdraw (should fail)
        vm.prank(users[1]);
        vm.expectRevert(CrowdfundingAlreadyFinalized.selector);
        repNetManager.withdraw(newCrowdfundingId);
    }

    function test_EdgeCases() public {
        // Test case: Create crowdfunding with minimum durations
        CrowdfundingCreationParams memory params = createDefaultCrowdfundingParams();
        uint256 currentTime = block.timestamp;
        params.fundingPhaseEnd = currentTime + MIN_FUNDING_PHASE_DURATION;
        params.submissionPhaseEnd = params.fundingPhaseEnd + MIN_SUBMISSION_PHASE_DURATION;
        params.votingPhaseEnd = params.submissionPhaseEnd + MIN_VOTING_PHASE_DURATION;

        vm.deal(users[0], ONE_ETH);
        vm.prank(users[0]);
        repNetManager.createCrowdfunding{value: ONE_ETH}(params);
        uint256 minDurationCrowdfundingId = repNetManager.crowdfundingId() - 1;

        // Verify phases with minimum durations
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(minDurationCrowdfundingId);
        assertEq(cf.fundingPhaseEnd, currentTime + MIN_FUNDING_PHASE_DURATION, "Funding phase end should match");
        assertEq(
            cf.submissionPhaseEnd,
            currentTime + MIN_FUNDING_PHASE_DURATION + MIN_SUBMISSION_PHASE_DURATION,
            "Submission phase end should match"
        );
        assertEq(
            cf.votingPhaseEnd,
            currentTime + MIN_FUNDING_PHASE_DURATION + MIN_SUBMISSION_PHASE_DURATION + MIN_VOTING_PHASE_DURATION,
            "Voting phase end should match"
        );

        // Test case: Create crowdfunding with maximum developer fee
        params = createDefaultCrowdfundingParams();
        params.developerFeePercentage = MAX_DEVELOPER_FEE_PERCENTAGE;

        vm.deal(users[1], ONE_ETH);
        vm.prank(users[1]);
        repNetManager.createCrowdfunding{value: ONE_ETH}(params);
        uint256 maxDevFeeCrowdfundingId = repNetManager.crowdfundingId() - 1;

        // Verify maximum developer fee
        cf = repNetManager.getCrowdfunding(maxDevFeeCrowdfundingId);
        assertEq(
            cf.developerFeePercentage, MAX_DEVELOPER_FEE_PERCENTAGE, "Developer fee percentage should match maximum"
        );

        // Test case: Create crowdfunding with zero raise cap (unlimited)
        params = createDefaultCrowdfundingParams();
        params.raiseCap = 0;

        vm.deal(users[2], ONE_ETH);
        vm.prank(users[2]);
        repNetManager.createCrowdfunding{value: ONE_ETH}(params);
        uint256 noCapCrowdfundingId = repNetManager.crowdfundingId() - 1;

        // Fund with a large amount
        vm.deal(users[3], 100 ether);
        vm.prank(users[3]);
        repNetManager.fund{value: 100 ether}(noCapCrowdfundingId);

        // Verify no cap limit was enforced
        cf = repNetManager.getCrowdfunding(noCapCrowdfundingId);
        assertEq(cf.amountRaised, 101 ether, "Amount raised should include all funds");

        // Test case: Try to create crowdfunding with too high developer fee
        params = createDefaultCrowdfundingParams();
        params.developerFeePercentage = MAX_DEVELOPER_FEE_PERCENTAGE + 1;

        vm.deal(users[4], ONE_ETH);
        vm.prank(users[4]);
        vm.expectRevert(
            abi.encodeWithSelector(DeveloperFeePercentageTooHigh.selector, MAX_DEVELOPER_FEE_PERCENTAGE + 1)
        );
        repNetManager.createCrowdfunding{value: ONE_ETH}(params);
    }

}
