// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";
import "./helpers/TestHelpers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RepNetManager_SubmitTest is TestHelpers {

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

        // Move to submission phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);
    }

    function test_Submit_Success() public {
        // Owner submits a solution for user1
        bytes32 submissionId = keccak256("solution1");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Verify the submission was successful
        bytes32[] memory submissions = repNetManager.submissions(crowdfundingId);
        assertEq(submissions.length, 1, "Should have 1 submission");
        assertEq(submissions[0], submissionId, "Submission ID should match");

        // Verify the submission details
        Submission memory submission = repNetManager.submission(crowdfundingId, submissionId);
        assertEq(submission.id, submissionId, "Submission ID should match");
        assertEq(submission.creator, user1, "Creator should be user1");
        assertEq(submission.timestamp, block.timestamp, "Timestamp should match current block timestamp");
    }

    function test_Submit_OnlyOwner() public {
        // Non-owner tries to submit a solution
        bytes32 submissionId = keccak256("solution1");
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));
        repNetManager.submit(crowdfundingId, submissionId, user1);
    }

    function test_Submit_OnlyInSubmissionPhase() public {
        // Move back to funding phase
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd - 1);

        // Try to submit during funding phase
        bytes32 submissionId = keccak256("solution1");
        vm.prank(owner);
        vm.expectRevert(NotInSubmissionPhase.selector);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Move to voting phase
        vm.warp(cf.submissionPhaseEnd + 1);

        // Try to submit during voting phase
        vm.prank(owner);
        vm.expectRevert(NotInSubmissionPhase.selector);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Move to ended phase
        vm.warp(cf.votingPhaseEnd + 1);

        // Try to submit during ended phase
        vm.prank(owner);
        vm.expectRevert(NotInSubmissionPhase.selector);
        repNetManager.submit(crowdfundingId, submissionId, user1);
    }

    function test_Submit_CannotSubmitSameHashTwice() public {
        // Submit a solution
        bytes32 submissionId = keccak256("solution1");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Try to submit the same solution again for a different user
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(SolutionAlreadySubmitted.selector, submissionId));
        repNetManager.submit(crowdfundingId, submissionId, user2);
    }

    function test_Submit_MultipleSubmissions() public {
        // Submit first solution
        bytes32 submissionId1 = keccak256("solution1");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId1, user1);

        // Submit second solution
        bytes32 submissionId2 = keccak256("solution2");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId2, user2);

        // Submit third solution for the same user
        bytes32 submissionId3 = keccak256("solution3");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId3, user1);

        // Verify all submissions were successful
        bytes32[] memory submissions = repNetManager.submissions(crowdfundingId);
        assertEq(submissions.length, 3, "Should have 3 submissions");

        // Verify the submission details
        Submission memory submission1 = repNetManager.submission(crowdfundingId, submissionId1);
        assertEq(submission1.creator, user1, "Creator of submission1 should be user1");

        Submission memory submission2 = repNetManager.submission(crowdfundingId, submissionId2);
        assertEq(submission2.creator, user2, "Creator of submission2 should be user2");

        Submission memory submission3 = repNetManager.submission(crowdfundingId, submissionId3);
        assertEq(submission3.creator, user1, "Creator of submission3 should be user1");
    }

    function test_Submit_EmitsEvent() public {
        // Expect the SolutionSubmitted event to be emitted
        bytes32 submissionId = keccak256("solution1");
        vm.expectEmit(true, false, false, true);
        emit SolutionSubmitted(crowdfundingId, submissionId, user1);

        // Submit a solution
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user1);
    }

    function test_Submit_FailsForNonExistentCrowdfunding() public {
        uint256 nonExistentCrowdfundingId = 999;
        bytes32 submissionId = keccak256("solution1");

        vm.prank(owner);
        vm.expectRevert(CrowdfundingNotFound.selector);
        repNetManager.submit(nonExistentCrowdfundingId, submissionId, user1);
    }

    function test_Submit_UpdatesNumSubmissions() public {
        // Check initial number of submissions
        CrowdfundingShort memory cf = repNetManager.crowdfunding(crowdfundingId);
        assertEq(cf.numSubmissions, 0, "Initial number of submissions should be 0");

        // Submit first solution
        bytes32 submissionId1 = keccak256("solution1");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId1, user1);

        // Check updated number of submissions
        cf = repNetManager.crowdfunding(crowdfundingId);
        assertEq(cf.numSubmissions, 1, "Number of submissions should be 1");

        // Submit second solution
        bytes32 submissionId2 = keccak256("solution2");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId2, user2);

        // Check updated number of submissions
        cf = repNetManager.crowdfunding(crowdfundingId);
        assertEq(cf.numSubmissions, 2, "Number of submissions should be 2");
    }

    function test_Submit_ZeroAddressCreator() public {
        // Try to submit with address(0) as creator
        bytes32 submissionId = keccak256("solution1");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, address(0));

        // Verify the submission was successful
        Submission memory submission = repNetManager.submission(crowdfundingId, submissionId);
        assertEq(submission.creator, address(0), "Creator should be address(0)");
    }

    function test_Submit_SubmissionIdZero() public {
        // Try to submit with bytes32(0) as submissionId
        bytes32 submissionId = bytes32(0);
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Verify the submission was successful
        Submission memory submission = repNetManager.submission(crowdfundingId, submissionId);
        assertEq(submission.id, submissionId, "Submission ID should be bytes32(0)");
        assertEq(submission.creator, user1, "Creator should be user1");
    }

}
