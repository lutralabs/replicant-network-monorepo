# Envio Indexer Configs

Indexer for the Replicant Network.

## Overview

This indexer tracks events from the Replicant Network smart contracts, including:
* Crowdfunding creation and finalization
* Solution submissions
* Voting
* Funding transactions
* Withdrawals

## Prerequisites

* Node.js (v18 or later recommended)
* pnpm package manager
* Envio API token (obtain from [Envio Dashboard](https://envio.dev/app/api-tokens))

## Getting Started

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

Copy the example environment file and update it with your Envio API token:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Envio API token:

```
ENVIO_API_TOKEN="your-api-token-here"
```

### Development

Start the development server:

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Testing

Run tests:

```bash
pnpm test
```

## Configuration

The indexer is configured in `config.yaml` , which specifies:
* Network configuration
* ABI paths
* Contract addresses
* Events to track
* Handler file locations

## GraphQL Schema

The GraphQL schema in `schema.graphql` defines the data model for the indexed data.
