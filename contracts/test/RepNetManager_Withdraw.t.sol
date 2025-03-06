// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";
import "./helpers/TestHelpers.sol";

contract RepNetManager_WithdrawTest is TestHelpers {

    uint256 public crowdfundingId;

    function setUp() public {
        setupAddresses();
        setupRepNetManager();

        // Create a crowdfunding for testing
        crowdfundingId = createAndFundCrowdfunding(owner, ONE_ETH);

        // Fund the crowdfunding with multiple users
        vm.deal(user1, ONE_ETH);
        vm.prank(user1);
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);

        vm.deal(user2, ONE_ETH);
        vm.prank(user2);
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);
    }

    function test_Withdraw_Success() public {
        // Move to ended phase without any submissions or votes
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize without a winner (no submissions/votes)
        repNetManager.finalize(crowdfundingId);

        // Check that the crowdfunding is finalized without a winner
        cf = repNetManager.crowdfunding(crowdfundingId);
        assertTrue(cf.finalized, "Crowdfunding should be finalized");
        assertEq(cf.winner, address(0), "Winner should be address(0)");

        // Record user1's balance before withdrawal
        uint256 balanceBefore = user1.balance;

        // User1 withdraws their funds
        vm.prank(user1);
        repNetManager.withdraw(crowdfundingId);

        // Verify user1's balance increased by their deposit
        assertEq(user1.balance, balanceBefore + ONE_ETH, "User1 should have received their deposit back");

        // Try to withdraw again (should fail)
        vm.prank(user1);
        vm.expectRevert(NoDeposits.selector);
        repNetManager.withdraw(crowdfundingId);
    }

    function test_Withdraw_OnlyInEndedPhase() public {
        // Try to withdraw during funding phase
        vm.prank(user1);
        vm.expectRevert(CrowdfundingStillActive.selector);
        repNetManager.withdraw(crowdfundingId);

        // Move to submission phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        // Try to withdraw during submission phase
        vm.prank(user1);
        vm.expectRevert(CrowdfundingStillActive.selector);
        repNetManager.withdraw(crowdfundingId);

        // Move to voting phase
        vm.warp(cf.submissionPhaseEnd + 1);

        // Try to withdraw during voting phase
        vm.prank(user1);
        vm.expectRevert(CrowdfundingStillActive.selector);
        repNetManager.withdraw(crowdfundingId);
    }

    function test_Withdraw_FailsIfCrowdfundingFinalizedWithWinner() public {
        // Move to submission phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        // Submit a solution
        bytes32 submissionId = keccak256("solution");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user3);

        // Move to voting phase
        vm.warp(cf.submissionPhaseEnd + 1);

        // User1 votes for the submission
        vm.prank(user1);
        repNetManager.vote(crowdfundingId, submissionId);

        // User2 votes for the submission
        vm.prank(user2);
        repNetManager.vote(crowdfundingId, submissionId);

        // Move to ended phase
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize with a winner
        repNetManager.finalize(crowdfundingId);

        // Check that the crowdfunding is finalized with a winner
        cf = repNetManager.crowdfunding(crowdfundingId);
        assertTrue(cf.finalized, "Crowdfunding should be finalized");
        assertEq(cf.winner, user3, "Winner should be user3");

        // Try to withdraw (should fail)
        vm.prank(user1);
        vm.expectRevert(CrowdfundingAlreadyFinalized.selector);
        repNetManager.withdraw(crowdfundingId);
    }

    function test_Withdraw_FailsIfNoDeposits() public {
        // Move to ended phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize without a winner
        repNetManager.finalize(crowdfundingId);

        // Try to withdraw with a user who hasn't funded
        vm.prank(user3);
        vm.expectRevert(NoDeposits.selector);
        repNetManager.withdraw(crowdfundingId);
    }

    function test_Withdraw_MultipleFunders() public {
        // Move to ended phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize without a winner
        repNetManager.finalize(crowdfundingId);

        // Record balances before withdrawal
        uint256 ownerBalanceBefore = owner.balance;
        uint256 user1BalanceBefore = user1.balance;
        uint256 user2BalanceBefore = user2.balance;

        // All users withdraw their funds
        vm.prank(owner);
        repNetManager.withdraw(crowdfundingId);

        vm.prank(user1);
        repNetManager.withdraw(crowdfundingId);

        vm.prank(user2);
        repNetManager.withdraw(crowdfundingId);

        // Verify all balances increased by their deposits
        assertEq(owner.balance, ownerBalanceBefore + ONE_ETH, "Owner should have received their deposit back");
        assertEq(user1.balance, user1BalanceBefore + ONE_ETH, "User1 should have received their deposit back");
        assertEq(user2.balance, user2BalanceBefore + ONE_ETH, "User2 should have received their deposit back");
    }

    function test_Withdraw_FailsForNonExistentCrowdfunding() public {
        uint256 nonExistentCrowdfundingId = 999;

        vm.prank(user1);
        vm.expectRevert(CrowdfundingNotFound.selector);
        repNetManager.withdraw(nonExistentCrowdfundingId);
    }

    function test_Withdraw_PartialFunding() public {
        // Create a new crowdfunding
        uint256 newCrowdfundingId = createAndFundCrowdfunding(owner, ONE_ETH);

        // User1 funds with different amounts in multiple transactions
        vm.deal(user1, THREE_ETH);

        vm.prank(user1);
        repNetManager.fund{value: ONE_ETH}(newCrowdfundingId);

        vm.prank(user1);
        repNetManager.fund{value: TWO_ETH}(newCrowdfundingId);

        // Move to ended phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(newCrowdfundingId);
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize without a winner
        repNetManager.finalize(newCrowdfundingId);

        // Record user1's balance before withdrawal
        uint256 balanceBefore = user1.balance;

        // User1 withdraws their funds
        vm.prank(user1);
        repNetManager.withdraw(newCrowdfundingId);

        // Verify user1's balance increased by their total deposit (3 ETH)
        assertEq(user1.balance, balanceBefore + THREE_ETH, "User1 should have received their total deposit back");
    }

    function test_Withdraw_EmitsEvent() public {
        // Move to ended phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize without a winner
        repNetManager.finalize(crowdfundingId);

        // Expect the Withdrawal event to be emitted
        vm.expectEmit(true, true, true, true);
        emit Withdrawal(crowdfundingId, user1, ONE_ETH);

        // User1 withdraws their funds
        vm.prank(user1);
        repNetManager.withdraw(crowdfundingId);
    }

}
