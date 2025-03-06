<p align="center">
  <img src="assets/rn-logo.png" alt="Replicant Network Logo" width="128"/>
</p>

<h1 align="center">Replicant Network</h1>

<p align="center">
  AI Models. Made for You.
</p>

## 🌟 Project Overview

Replicant Network is a decentralized platform that revolutionizes AI model development by creating a transparent and efficient ecosystem for crowdfunding, building, and deploying AI models. Built on Monad's accelerated EVM, it enables:

* **Transparent Crowdfunding**: Anyone can create or contribute to AI model development campaigns
* **Decentralized Governance**: Token holders vote on model submissions
* **Efficient Deployment**: Seamless deployment of AI models for inference
* **Tokenization & Shared Ownership**: Models are tokenized, enabling shared ownership and revenue sharing among contributors

## 🏗️ Architecture

Replicant Network consists of three main components:

1. **Smart Contracts**: Solidity contracts deployed on Monad for crowdfunding, model submission, and token management
2. **Dapp**: Next.js frontend application for interacting with the platform
3. **AI Manager**: FastAPI-based service for managing and running AI inference tasks
4. **Model/Crowdfunding Metadata Storage**: IPFS-based storage for model and campaign metadata
5. **Model Storage**: Secure storage for AI model files and weights

<p align="center">
  <img src="assets/architecture-diagram.svg" alt="Replicant Network Architecture" width="800"/>
</p>

## 🚀 Key Features

* **Crowdfunding Campaigns**: Create and fund AI model development campaigns
* **Token-Based Governance & Ownership**: Each campaign creates its own ERC20 token for voting, ownership, and revenue sharing
* **Model Submission**: Developers can submit AI models to campaigns
* **Voting System**: Token holders vote on the best model submissions
* **Reward Distribution**: Automatic distribution of rewards to winning developers
* **Model Monetization**: Users can use models via our platform for small fees, with revenue shared among token holders

## 📁 Repository Structure

```
replicant-network-monorepo/
├── apps/
│   ├── dapp/             # Next.js frontend application
│   ├── ai-manager/       # AI inference service
│   └── envio/            # Indexer for blockchain events
└── contracts/            # Solidity smart contracts
```

## 🛠️ Technologies Used

* **Blockchain**: Monad (EVM-compatible)
* **Smart Contracts**: Solidity, Foundry
* **Frontend**: Next.js, TypeScript, TailwindCSS, wagmi
* **Backend**: FastAPI, Python
* **AI**: PyTorch
* **DevOps**: Docker, GitHub Actions

## 🏁 Getting Started

### Prerequisites

* Node.js (v20.18.0 or higher)
* PNPM (v9.14.2 or higher)
* Python 3.10+
* Docker (for AI Manager)

### Installation

1. Clone the repository:
   

```bash
git clone https://github.com/lutralabs/replicant-network-monorepo.git
cd replicant-network-monorepo
```

2. Install dependencies:
   

```bash
pnpm install
```

3. Build all packages:
   

```bash
pnpm build
```

### Running the Dapp

```bash
cd apps/dapp
# Set the variables in .env as seen in .env.example
pnpm dev
```

The application will be available at http://localhost:3000.

### Running the AI Manager

```bash
cd apps/ai-manager
docker-compose up -d
```

The API will be available at http://localhost:8000.

### Deploying Smart Contracts

```bash
cd contracts
forge create src/RepNetManager.sol:RepNetManager --private-key <your-private-key>
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific tests
cd contracts
forge test

cd apps/envio
pnpm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Additional Documentation

* [Technical Documentation](TECHNICAL.md) - Detailed technical architecture and implementation details
