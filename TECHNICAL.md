# Replicant Network - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Smart Contracts](#smart-contracts)
3. [Frontend Application](#frontend-application)
4. [AI Manager Service](#ai-manager-service)

## Architecture Overview

Replicant Network is built as a three-tier architecture:

1. **Smart Contracts Layer**: Solidity contracts deployed on Monad blockchain
2. **Frontend Layer**: Next.js application for user interaction
3. **AI Service Layer**: FastAPI service for AI model management and inference

The system uses a monorepo structure to manage all components in a single repository, with clear separation of concerns between different modules.

## Smart Contracts

### Core Contracts

* **RepNetManager.sol**: The main contract that orchestrates the entire crowdfunding lifecycle
* **ModelTokenERC20.sol**: ERC20 token implementation for model-specific tokens, used for onchain voting, revenue sharing and ownership
* **ERC20Factory.sol**: Factory contract for creating new model tokens
* **DataTypes.sol**: Shared data structures and events

For more detailed information about the smart contracts and their functions, please refer to the [contracts/README.md](contracts/README.md).

### Crowdfunding Lifecycle

The crowdfunding process consists of four distinct phases:

1. **Funding Phase**: Users contribute ETH to the campaign and receive governance tokens
2. **Submission Phase**: Developers submit their AI model solutions
3. **Voting Phase**: Token holders vote on the best model submission
4. **Ended Phase**: The winning model is selected and rewards are distributed

### Key Smart Contract Features

* **Token-based Governance**: Each campaign creates its own ERC20 token for voting
* **Phase Management**: Automatic transition between phases based on timestamps
* **Voting Mechanism**: Weighted voting based on token holdings
* **Reward Distribution**: Automatic distribution of funds to the winning developer
* **Refund Mechanism**: Refunds for contributors if no valid submission is selected

### Contract Security

* **ReentrancyGuard**: Protection against reentrancy attacks
* **Ownership Management**: Proper access control using OpenZeppelin's Ownable
* **Input Validation**: Comprehensive validation of all inputs
* **Error Handling**: Custom error types for clear error reporting

## Frontend Application

### Technology Stack

* **Framework**: Next.js with App Router
* **State Management**: React Context and Hooks
* **Styling**: [TailwindCSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
* **Web3 Integration**: [wagmi](https://wagmi.sh/), [viem](https://viem.sh/), and [Privy](https://privy.io/)

### Key Frontend Features

* **Crowdfunding Creation**: User-friendly interface for creating new crowdfundings
* **Crowdfunding Exploration**: Browse and filter active crowdfundings
* **Model Submission**: Interface for submitting AI models
* **Voting Interface**: Simple voting mechanism for token holders
* **AI Model Interaction**: Interface for using deployed AI models

## AI Manager Service

### Technology Stack

* **Framework**: FastAPI
* **Model Management**: Custom model registry
* **Containerization**: Docker

### Key AI Manager Features

* **Model Registry**: Dynamic discovery and registration of AI models
* **Inference API**: REST API for model inference
* **Asynchronous Processing**: Background task processing for long-running operations
