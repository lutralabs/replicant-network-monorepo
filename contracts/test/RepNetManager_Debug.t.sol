// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";
import "./helpers/TestHelpers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RepNetManager_DebugTest is TestHelpers {

    uint256 public crowdfundingId;

    function setUp() public {
        setupAddresses();
        setupRepNetManager();

        // Create a crowdfunding for testing
        crowdfundingId = createAndFundCrowdfunding(owner, ONE_ETH);
    }

    function test_ChangePhase_ToFunding() public {
        // Initially in funding phase
        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Funding),
            "Should start in funding phase"
        );

        // Move to submission phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Submission),
            "Should be in submission phase after warping"
        );

        // Change back to funding phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Funding);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Funding),
            "Should be back in funding phase after _changePhase"
        );
    }

    function test_ChangePhase_ToSubmission() public {
        // Initially in funding phase
        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Funding),
            "Should start in funding phase"
        );

        // Change to submission phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Submission);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Submission),
            "Should be in submission phase after _changePhase"
        );
    }

    function test_ChangePhase_ToVoting() public {
        // Initially in funding phase
        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Funding),
            "Should start in funding phase"
        );

        // Change to voting phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Voting);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Voting),
            "Should be in voting phase after _changePhase"
        );
    }

    function test_ChangePhase_ToEnded() public {
        // Initially in funding phase
        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Funding),
            "Should start in funding phase"
        );

        // Change to ended phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Ended);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Ended),
            "Should be in ended phase after _changePhase"
        );
    }

    function test_ChangePhase_OnlyOwner() public {
        // Non-owner tries to change phase
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Submission);
    }

    function test_ChangePhase_EnablesPhaseRestrictedActions() public {
        // Submit a solution
        bytes32 submissionId = keccak256("solution");

        // Try to submit during funding phase (should fail)
        vm.prank(owner);
        vm.expectRevert(NotInSubmissionPhase.selector);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Change to submission phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Submission);

        // Now submission should work
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Try to vote (should fail in submission phase)
        vm.prank(user2);
        vm.expectRevert(NotInVotingPhase.selector);
        repNetManager.vote(crowdfundingId, submissionId);

        // Change to voting phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Voting);

        // Now voting should work, but revert with NoDeposits
        vm.prank(user2);
        vm.expectRevert(NoDeposits.selector);
        repNetManager.vote(crowdfundingId, submissionId);

        // Try to finalize (should fail while active)
        vm.prank(owner);
        vm.expectRevert(CrowdfundingStillActive.selector);
        repNetManager.finalize(crowdfundingId);

        // Change to ended phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Ended);

        // Now finalize should work
        repNetManager.finalize(crowdfundingId);
    }

    function test_ChangePhase_MultipleTimes() public {
        // Change to submission phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Submission);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Submission),
            "Should be in submission phase"
        );

        // Change to voting phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Voting);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Voting),
            "Should be in voting phase"
        );

        // Change to ended phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Ended);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Ended),
            "Should be in ended phase"
        );

        // Change back to funding phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Funding);

        assertEq(
            uint256(repNetManager.crowdfundingPhase(crowdfundingId)),
            uint256(CrowdfundingPhase.Funding),
            "Should be back in funding phase"
        );
    }

    function test_ChangePhase_VerifyTimestamps() public {
        // Get initial timestamps
        CrowdfundingShort memory initialCf = repNetManager.crowdfunding(crowdfundingId);

        // Change to submission phase
        vm.prank(owner);
        repNetManager._changePhase(crowdfundingId, CrowdfundingPhase.Submission);

        // Get updated timestamps
        CrowdfundingShort memory updatedCf = repNetManager.crowdfunding(crowdfundingId);

        // Verify timestamps were updated correctly
        assertEq(
            updatedCf.fundingPhaseEnd, block.timestamp - 1 days, "Funding phase end should be 1 day before current time"
        );

        assertEq(
            updatedCf.submissionPhaseEnd,
            block.timestamp + 1 days,
            "Submission phase end should be 1 day after current time"
        );

        assertEq(
            updatedCf.votingPhaseEnd, block.timestamp + 2 days, "Voting phase end should be 2 days after current time"
        );

        // Verify timestamps are different from initial ones
        assertTrue(initialCf.fundingPhaseEnd != updatedCf.fundingPhaseEnd, "Funding phase end should have changed");

        assertTrue(
            initialCf.submissionPhaseEnd != updatedCf.submissionPhaseEnd, "Submission phase end should have changed"
        );

        assertTrue(initialCf.votingPhaseEnd != updatedCf.votingPhaseEnd, "Voting phase end should have changed");
    }

}
