// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../src/DataTypes.sol";
import "../src/ModelTokenERC20.sol";
import "../src/RepNetManager.sol";
import "../src/interfaces/IModelTokenERC20.sol";
import "./helpers/TestHelpers.sol";

contract ModelTokenERC20Test is TestHelpers {

    // Additional test addresses
    address public nonOwner;
    address public tokenReceiver;

    // Test token parameters
    string public validName = "Test Token";
    string public validSymbol = "TST";
    string public longName =
        "This is an extremely long token name that exceeds the maximum allowed length for a token name in the system";
    string public longSymbol = "VERYLONGSYMBOL";
    string public emptyName = "";
    string public emptySymbol = "";

    // Token address
    address public tokenAddress;
    IModelTokenERC20 public token;

    function setUp() public {
        setupAddresses();
        setupRepNetManager();

        // Set up additional addresses
        nonOwner = makeAddr("nonOwner");
        tokenReceiver = makeAddr("tokenReceiver");
    }

    // Helper function to create a crowdfunding and return the token address
    function createCrowdfundingAndGetToken(
        address creator,
        string memory name,
        string memory symbol
    ) internal returns (address) {
        vm.deal(creator, 1 ether);
        vm.prank(creator);
        uint256 crowdfundingId = repNetManager.createCrowdfunding{value: 1 ether}(
            CrowdfundingCreationParams({
                name: name,
                symbol: symbol,
                fundingPhaseEnd: block.timestamp + 10 days,
                submissionPhaseEnd: block.timestamp + 20 days,
                votingPhaseEnd: block.timestamp + 30 days,
                raiseCap: 1000 ether,
                developerFeePercentage: 1000
            })
        );
        CrowdfundingShort memory cf = repNetManager.getCrowdfunding(crowdfundingId);
        return cf.token;
    }

    function test_DeployTokenViaRepNetManager() public {
        // Deploy token via RepNetManager
        tokenAddress = createCrowdfundingAndGetToken(owner, validName, validSymbol);

        // Verify token was deployed correctly
        token = IModelTokenERC20(tokenAddress);
        assertEq(token.name(), validName);
        assertEq(token.symbol(), validSymbol);

        // Verify owner is set correctly (RepNetManager should be the owner)
        // We can verify this by checking who can mint tokens
        vm.prank(address(repNetManager));
        token.mint(tokenReceiver, 1000);
        assertEq(token.balanceOf(tokenReceiver), 1000);
    }

    function test_OnlyRepNetManagerCanMint() public {
        // Deploy token via RepNetManager
        tokenAddress = createCrowdfundingAndGetToken(owner, validName, validSymbol);
        token = IModelTokenERC20(tokenAddress);

        // Try to mint as non-owner (should revert)
        vm.prank(nonOwner);
        vm.expectRevert();
        token.mint(tokenReceiver, 1000);

        // Try to mint as owner of RepNetManager (should revert)
        vm.prank(owner);
        vm.expectRevert();
        token.mint(tokenReceiver, 1000);

        // Mint as RepNetManager (should succeed)
        vm.prank(address(repNetManager));
        token.mint(tokenReceiver, 1000);
        assertEq(token.balanceOf(tokenReceiver), 1000);
    }

    function test_TokenNameLengthConstraints() public {
        // Test with empty name (should revert)
        vm.deal(owner, 1 ether);
        vm.prank(owner);
        vm.expectRevert();
        repNetManager.createCrowdfunding{value: 1 ether}(
            CrowdfundingCreationParams({
                name: emptyName,
                symbol: validSymbol,
                fundingPhaseEnd: block.timestamp + 10 days,
                submissionPhaseEnd: block.timestamp + 20 days,
                votingPhaseEnd: block.timestamp + 30 days,
                raiseCap: 1000 ether,
                developerFeePercentage: 1000
            })
        );

        // Test with too long name (should revert)
        vm.deal(owner, 1 ether);
        vm.prank(owner);
        vm.expectRevert();
        repNetManager.createCrowdfunding{value: 1 ether}(
            CrowdfundingCreationParams({
                name: longName,
                symbol: validSymbol,
                fundingPhaseEnd: block.timestamp + 10 days,
                submissionPhaseEnd: block.timestamp + 20 days,
                votingPhaseEnd: block.timestamp + 30 days,
                raiseCap: 1000 ether,
                developerFeePercentage: 1000
            })
        );

        // Test with valid name (should succeed)
        tokenAddress = createCrowdfundingAndGetToken(owner, validName, validSymbol);
        token = IModelTokenERC20(tokenAddress);
        assertEq(token.name(), validName);
    }

    function test_TokenSymbolLengthConstraints() public {
        // Test with empty symbol (should revert)
        vm.deal(owner, 1 ether);
        vm.prank(owner);
        vm.expectRevert();
        repNetManager.createCrowdfunding{value: 1 ether}(
            CrowdfundingCreationParams({
                name: validName,
                symbol: emptySymbol,
                fundingPhaseEnd: block.timestamp + 10 days,
                submissionPhaseEnd: block.timestamp + 20 days,
                votingPhaseEnd: block.timestamp + 30 days,
                raiseCap: 1000 ether,
                developerFeePercentage: 1000
            })
        );

        // Test with too long symbol (should revert)
        vm.deal(owner, 1 ether);
        vm.prank(owner);
        vm.expectRevert();
        repNetManager.createCrowdfunding{value: 1 ether}(
            CrowdfundingCreationParams({
                name: validName,
                symbol: longSymbol,
                fundingPhaseEnd: block.timestamp + 10 days,
                submissionPhaseEnd: block.timestamp + 20 days,
                votingPhaseEnd: block.timestamp + 30 days,
                raiseCap: 1000 ether,
                developerFeePercentage: 1000
            })
        );

        // Test with valid symbol (should succeed)
        tokenAddress = createCrowdfundingAndGetToken(owner, validName, validSymbol);
        token = IModelTokenERC20(tokenAddress);
        assertEq(token.symbol(), validSymbol);
    }

    function test_MintingViaRepNetManagerFunctions() public {
        // Create a crowdfunding to test minting via RepNetManager functions
        uint256 fundingAmount = 1 ether;
        uint256 crowdfundingId = createAndFundCrowdfunding(owner, fundingAmount);

        // Get the token address from the crowdfunding
        address crowdfundingToken = repNetManager.getCrowdfunding(crowdfundingId).token;
        IModelTokenERC20 cfToken = IModelTokenERC20(crowdfundingToken);

        // Check initial balance (should be equal to funding amount * conversion rate)
        uint256 conversionRate = 1_000_000; // From RepNetManager
        assertEq(cfToken.balanceOf(owner), fundingAmount * conversionRate);

        // Fund the crowdfunding as another user
        uint256 user1FundingAmount = 0.5 ether;
        vm.deal(user1, user1FundingAmount);
        vm.prank(user1);
        repNetManager.fund{value: user1FundingAmount}(crowdfundingId);

        // Check that tokens were minted to user1
        assertEq(cfToken.balanceOf(user1), user1FundingAmount * conversionRate);

        // Test minting via finalization (need to go through submission and voting phases)
        // Move to submission phase
        vm.warp(block.timestamp + TWO_DAYS + 1);

        // Submit a solution
        bytes32 submissionId = keccak256("solution");
        vm.prank(owner);
        repNetManager.submit(crowdfundingId, submissionId, user1);

        // Move to voting phase
        vm.warp(block.timestamp + TWO_DAYS + 1);

        // Vote for the submission
        vm.prank(owner);
        repNetManager.vote(crowdfundingId, submissionId);

        // Move to ended phase
        vm.warp(block.timestamp + TWO_DAYS + 1);

        // Get initial balance of winner
        uint256 initialWinnerBalance = cfToken.balanceOf(user1);

        // Finalize the crowdfunding
        repNetManager.finalize(crowdfundingId);

        // Check that additional tokens were minted to the winner
        assertGt(cfToken.balanceOf(user1), initialWinnerBalance);
    }

    function test_DirectTokenCreation() public {
        // Try to create token directly (not via RepNetManager)
        vm.prank(nonOwner);
        ModelTokenERC20 directToken = new ModelTokenERC20(validName, validSymbol, nonOwner);

        // Verify token was created correctly
        assertEq(directToken.name(), validName);
        assertEq(directToken.symbol(), validSymbol);

        // Verify owner is set correctly
        vm.prank(nonOwner);
        directToken.mint(tokenReceiver, 1000);
        assertEq(directToken.balanceOf(tokenReceiver), 1000);

        // This shows that direct creation is possible, but in a real system,
        // access to the ModelTokenERC20 constructor should be restricted
    }

    function test_TokenTransferability() public {
        // Deploy token via RepNetManager
        tokenAddress = createCrowdfundingAndGetToken(owner, validName, validSymbol);
        token = IModelTokenERC20(tokenAddress);

        // Mint tokens to user1
        vm.prank(address(repNetManager));
        token.mint(user1, 1000);

        // Transfer tokens from user1 to user2
        vm.prank(user1);
        token.transfer(user2, 500);

        // Check balances
        assertEq(token.balanceOf(user1), 500);
        assertEq(token.balanceOf(user2), 500);
    }

    function test_TokenApprovalAndTransferFrom() public {
        // Deploy token via RepNetManager
        tokenAddress = createCrowdfundingAndGetToken(owner, validName, validSymbol);
        token = IModelTokenERC20(tokenAddress);

        // Mint tokens to user1
        vm.prank(address(repNetManager));
        token.mint(user1, 1000);

        // Approve user2 to spend user1's tokens
        vm.prank(user1);
        token.approve(user2, 500);

        // Check allowance
        assertEq(token.allowance(user1, user2), 500);

        // Transfer tokens from user1 to user3 using user2's approval
        vm.prank(user2);
        token.transferFrom(user1, user3, 300);

        // Check balances and remaining allowance
        assertEq(token.balanceOf(user1), 700);
        assertEq(token.balanceOf(user3), 300);
        assertEq(token.allowance(user1, user2), 200);
    }

    function test_RepNetManagerOwnership() public {
        // Deploy token via RepNetManager
        tokenAddress = createCrowdfundingAndGetToken(owner, validName, validSymbol);

        // Create a new RepNetManager instance
        vm.prank(owner);
        RepNetManager newRepNetManager = new RepNetManager();

        // Try to mint tokens using the new RepNetManager (should fail)
        vm.prank(address(newRepNetManager));
        vm.expectRevert();
        IModelTokenERC20(tokenAddress).mint(tokenReceiver, 1000);

        // Original RepNetManager should still be able to mint
        vm.prank(address(repNetManager));
        IModelTokenERC20(tokenAddress).mint(tokenReceiver, 1000);
        assertEq(IModelTokenERC20(tokenAddress).balanceOf(tokenReceiver), 1000);
    }

}
