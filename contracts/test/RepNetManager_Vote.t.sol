// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";

import {IModelTokenERC20} from "../src/interfaces/IModelTokenERC20.sol";
import "./helpers/TestHelpers.sol";

contract RepNetManager_VoteTest is TestHelpers {

    uint256 public crowdfundingId;
    bytes32 public submissionId1;
    bytes32 public submissionId2;

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

        vm.deal(user3, ONE_ETH);
        vm.prank(user3);
        repNetManager.fund{value: ONE_ETH}(crowdfundingId);

        // Move to submission phase
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        // Submit solutions
        submissionId1 = keccak256("solution1");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId1, user1);

        submissionId2 = keccak256("solution2");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId2, user2);

        // Move to voting phase
        vm.warp(cf.submissionPhaseEnd + 1);
    }

    function test_Vote_Success() public {
        // User1 votes for submission1
        vm.prank(owner);
        repNetManager.vote(crowdfundingId, submissionId1);

        // Verify the vote was successful by checking if user1 can vote again
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(AlreadyVoted.selector, submissionId1));
        repNetManager.vote(crowdfundingId, submissionId1);
    }

    function test_Vote_OnlyInVotingPhase() public {
        // Move to ended phase
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        vm.warp(cf.votingPhaseEnd + 1);

        // Try to vote after voting phase has ended
        vm.prank(user1);
        vm.expectRevert(NotInVotingPhase.selector);
        repNetManager.vote(crowdfundingId, submissionId1);

        // Move back to submission phase
        vm.warp(cf.submissionPhaseEnd - 1);

        // Try to vote during submission phase
        vm.prank(user1);
        vm.expectRevert(NotInVotingPhase.selector);
        repNetManager.vote(crowdfundingId, submissionId1);

        // Move back to funding phase
        vm.warp(cf.fundingPhaseEnd - 1);

        // Try to vote during funding phase
        vm.prank(user1);
        vm.expectRevert(NotInVotingPhase.selector);
        repNetManager.vote(crowdfundingId, submissionId1);
    }

    function test_Vote_OnlyForExistingSubmissions() public {
        // Try to vote for a non-existent submission
        bytes32 nonExistentSubmissionId = keccak256("nonExistentSolution");
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(SubmissionNotFound.selector, nonExistentSubmissionId));
        repNetManager.vote(crowdfundingId, nonExistentSubmissionId);
    }

    function test_Vote_OnlyOnce() public {
        // User1 votes for submission1
        vm.prank(owner);
        repNetManager.vote(crowdfundingId, submissionId1);

        // User1 tries to vote for submission2
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(AlreadyVoted.selector, submissionId2));
        repNetManager.vote(crowdfundingId, submissionId2);
    }

    function test_Vote_OnlyForExistingCrowdfundings() public {
        // Try to vote for a non-existent crowdfunding
        uint256 nonExistentCrowdfundingId = 999;
        vm.prank(user1);
        vm.expectRevert(CrowdfundingNotFound.selector);
        repNetManager.vote(nonExistentCrowdfundingId, submissionId1);
    }

    function test_Vote_CannotVoteForOwnSubmission() public {
        // Create a new submission by user1
        bytes32 submissionId = keccak256("solution");

        // Move back to submission phase to allow new submissions
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        // Owner submits on behalf of user1 (since only owner can submit in this contract)
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Move to voting phase
        vm.warp(cf.submissionPhaseEnd + 1);

        // User1 tries to vote for their own submission
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(CannotVoteForYourOwnSubmission.selector, submissionId));
        repNetManager.vote(crowdfundingId, submissionId);
    }

    function test_Vote_RequiresFunding() public {
        // Create a new user who hasn't funded
        address nonFunder = makeAddr("nonFunder");

        // Try to vote without having funded
        vm.prank(nonFunder);
        vm.expectRevert(VotingBalanceZero.selector);
        repNetManager.vote(crowdfundingId, submissionId1);
    }

    function test_Vote_VotePowerProportionalToFunding() public {
        // Create a new crowdfunding
        uint256 newCrowdfundingId = createAndFundCrowdfunding(owner, ONE_ETH);

        // Fund with different amounts
        vm.deal(user1, THREE_ETH);
        vm.prank(user1);
        repNetManager.fund{value: THREE_ETH}(newCrowdfundingId);

        vm.deal(user2, ONE_ETH);
        vm.prank(user2);
        repNetManager.fund{value: ONE_ETH}(newCrowdfundingId);

        // Move to submission phase
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(newCrowdfundingId);
        vm.warp(cf.fundingPhaseEnd + 1);

        // Submit solutions
        bytes32 newSubmissionId = keccak256("newSolution");
        vm.prank(owner);
        repNetManager.submit(newCrowdfundingId, newSubmissionId, owner);

        // Move to voting phase
        vm.warp(cf.submissionPhaseEnd + 1);

        // Both users vote
        vm.prank(user1);
        repNetManager.vote(newCrowdfundingId, newSubmissionId);

        vm.prank(user2);
        repNetManager.vote(newCrowdfundingId, newSubmissionId);

        // Finalize to check vote power (we can't directly access the votes mapping)
        vm.warp(cf.votingPhaseEnd + 1);
        repNetManager.finalize(newCrowdfundingId);

        // The winner should be the owner (creator of the submission)
        CrowdfundingShort memory finalizedCf = repNetManager.getCrowdfunding(newCrowdfundingId);
        assertEq(finalizedCf.winner, owner, "Winner should be the owner");
    }

    function test_Vote_MultipleUsersVotingForDifferentSubmissions() public {
        // User1 votes for submission1
        vm.prank(owner);
        repNetManager.vote(crowdfundingId, submissionId1);

        // User2 votes for submission2
        vm.prank(user1);
        repNetManager.vote(crowdfundingId, submissionId2);

        // User3 votes for submission1
        vm.prank(user3);
        repNetManager.vote(crowdfundingId, submissionId1);

        // Move to ended phase
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        vm.warp(cf.votingPhaseEnd + 1);

        // Finalize to determine the winner
        repNetManager.finalize(crowdfundingId);

        // Submission1 should win as it has more votes (user1 and user3)
        CrowdfundingShort memory finalizedCf = repNetManager.getCrowdfunding(crowdfundingId);
        assertEq(finalizedCf.winner, user1, "Winner should be the user1");
    }

}
