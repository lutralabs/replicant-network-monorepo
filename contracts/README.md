# Replicant Network Smart Contracts

This directory contains the smart contracts for the Replicant Network, a decentralized platform for crowdfunding AI model development.

## Overview

The Replicant Network enables users to:
1. Create crowdfunding campaigns for AI model development
2. Fund campaigns with ETH
3. Submit solutions to funded campaigns
4. Vote on submitted solutions
5. Finalize campaigns and distribute rewards

## Contract Structure

### Core Contracts

* [**RepNetManager.sol**](./src/RepNetManager.sol): The main contract that manages the crowdfunding lifecycle, including creation, funding, submission, voting, and finalization.
* [**ModelTokenERC20.sol**](./src/ModelTokenERC20.sol): An ERC20 token contract that represents ownership in a crowdfunded model. Only the RepNetManager can mint these tokens.
* [**ERC20Factory.sol**](./src/ERC20Factory.sol): A factory contract that deploys new ModelTokenERC20 tokens for each crowdfunding campaign.

### Data Types

* [**DataTypes.sol**](./src/DataTypes.sol): Contains all the data structures and enums used throughout the system, including:
  + `CrowdfundingPhase`: Enum for the different phases (Funding, Submission, Voting, Ended)
  + `Crowdfunding`: Main data structure for crowdfunding campaigns
  + `Submission`: Data structure for submitted solutions
  + `Votes`: Data structure for tracking votes

### Interfaces

* [**IModelTokenERC20.sol**](./src/IModelTokenERC20.sol): Interface for the ModelTokenERC20 contract
* [**IERC20Factory.sol**](./src/IERC20Factory.sol): Interface for the ERC20Factory contract

## Key Constants

* `MAX_DEVELOPER_FEE_PERCENTAGE` - The maximum percentage of the model's token supply that the AI developer will receive if they win the bounty
* `MIN_FUNDING_PHASE_DURATION` - The minimum duration for the funding phase of a crowdfunding campaign
* `MIN_SUBMISSION_PHASE_DURATION` - The minimum duration for the submission phase of a crowdfunding campaign
* `MIN_VOTING_PHASE_DURATION` - The minimum duration for the voting phase of a crowdfunding campaign
* `MIN_VOTES_POWER_PERCENTAGE` - The threshold where voting is considered successful (at minimum 20% of the whole token supply must vote for the votes to be valid)
* `CONVERSION_RATE` - The rate at which users receive tokens for funding with MON

## Interacting with the Contracts

### From a Web3 Wallet or dApp

#### Creating a Crowdfunding Campaign

```javascript
import {
    createPublicClient,
    createWalletClient,
    http,
    parseEther
} from 'viem';
import {
    mainnet
} from 'viem/chains';
import {
    privateKeyToAccount
} from 'viem/accounts';

// Setup clients
const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
});

const account = privateKeyToAccount('0x...');
const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
});

// Parameters for creating a crowdfunding
const params = {
    name: "MyAIModel",
    symbol: "MAI",
    fundingPhaseEnd: BigInt(Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)), // 7 days from now
    submissionPhaseEnd: BigInt(Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60)), // 14 days from now
    votingPhaseEnd: BigInt(Math.floor(Date.now() / 1000) + (21 * 24 * 60 * 60)), // 21 days from now
    raiseCap: parseEther("10"), // 10 ETH cap (optional, 0 means no cap)
    developerFeePercentage: 1000n // 10%
};

// Initial funding amount
const initialFunding = parseEther("0.1"); // 0.1 ETH

// Create the crowdfunding
const hash = await walletClient.writeContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'createCrowdfunding',
    args: [params],
    value: initialFunding
});

// Wait for transaction to be mined
const receipt = await publicClient.waitForTransactionReceipt({
    hash
});
```

#### Funding a Campaign

```javascript
const crowdfundingId = 0n; // ID of the crowdfunding to fund
const fundingAmount = parseEther("1"); // 1 ETH

const hash = await walletClient.writeContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'fund',
    args: [crowdfundingId],
    value: fundingAmount
});

// Wait for transaction to be mined
const receipt = await publicClient.waitForTransactionReceipt({
    hash
});
```

#### Submitting a Solution

```javascript
// Note: This can only be called by the contract owner
const crowdfundingId = 0n;
const submissionHash = keccak256(stringToHex("solution-identifier"));
const creator = '0x...'; // Address of the solution creator

const hash = await walletClient.writeContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'submit',
    args: [crowdfundingId, submissionHash, creator]
});

// Wait for transaction to be mined
const receipt = await publicClient.waitForTransactionReceipt({
    hash
});
```

#### Voting on a Solution

```javascript
const crowdfundingId = 0n;
const submissionId = '0x...'; // The submission hash

const hash = await walletClient.writeContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'vote',
    args: [crowdfundingId, submissionId]
});

// Wait for transaction to be mined
const receipt = await publicClient.waitForTransactionReceipt({
    hash
});
```

#### Finalizing a Crowdfunding

```javascript
const crowdfundingId = 0n;

const hash = await walletClient.writeContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'finalize',
    args: [crowdfundingId]
});

// Wait for transaction to be mined
const receipt = await publicClient.waitForTransactionReceipt({
    hash
});
```

#### Withdrawing Funds

```javascript
const crowdfundingId = 0n;

const hash = await walletClient.writeContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'withdraw',
    args: [crowdfundingId]
});

// Wait for transaction to be mined
const receipt = await publicClient.waitForTransactionReceipt({
    hash
});
```

### Querying Contract State

```javascript
// Get crowdfunding details
const crowdfundingId = 0n;
const crowdfunding = await publicClient.readContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'crowdfunding',
    args: [crowdfundingId]
});

// Get current phase of a crowdfunding
const phase = await publicClient.readContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'crowdfundingPhase',
    args: [crowdfundingId]
});

// Get submissions for a crowdfunding
const submissions = await publicClient.readContract({
    address: '0x...', // RepNetManager address
    abi: repNetManagerABI,
    functionName: 'submissions',
    args: [crowdfundingId]
});
```

## Development

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

For more information on Foundry tools, see the [Foundry Documentation](https://book.getfoundry.sh/).

### Debug method calls (onlyOwner)

#### Submitting a solution

```
 cast send <contracAddress> "submit(uint256,bytes32,address)" <cfId> <modelHash> <creatorAddress> --account <name>
```

#### Change phase of an ongoing crowdfunding campaign

See [cast docs](https://book.getfoundry.sh/reference/cast/cast-send#wallet-options---raw) for how to specify the wallet.

```
cast send <contracAddress> "_changePhase(uint256,uint8)" <cfId> <phase> --account <name>
# <phase>
# 0 -> Funding
# 1 -> Submission
# 2 -> Voting
# 3 -> Ended
```
