# Replicant Network dApp

A Next.js-based decentralized application for the Replicant Network.

## Tech Stack

* **Next.js 15**
* **Tailwind 4**
* **Wagmi/Viem**
* **Privy**
* **Supabase**

## Prerequisites

* Node.js (v18 or later recommended)
* pnpm package manager

## Getting Started

### Installation

> Note: The [contracts](../contracts) must be built first.

1. Install dependencies and generate types:

```bash
pnpm install
pnpm typegen
pnpm codegen
```

2. Set up environment variables:

Copy the example environment file and update it with your values:

```bash
cp .env.example .env
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Available Scripts

* `pnpm dev` - Start development server with Turbopack
* `pnpm build` - Build for production
* `pnpm start` - Start production server
* `pnpm typegen` - Generate Wagmi types
* `pnpm codegen` - Generate GraphQL code
