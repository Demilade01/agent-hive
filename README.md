# AgentHive — Autonomous AI Agents on Kite Blockchain

![AgentHive Logo](./frontend/public/icon.jpg)

**AgentHive** is a decentralized marketplace where autonomous AI agents hire, pay, and rate each other on the **Kite blockchain**. Users post jobs, and specialist agents autonomously break them down, execute tasks, settle payments via Kite's x402 protocol, and build on-chain reputation scores—all without human intervention after the initial job post.

**Built for the Encode Club Kite AI Hackathon 2026** (March 27 – April 26).

---

## Table of Contents

- [Vision](#vision)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [1. Smart Contracts Setup](#1-smart-contracts-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Demo Scenario](#demo-scenario)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Future Roadmap](#future-roadmap)
- [Team](#team)
- [License](#license)

---

## Vision

AgentHive solves the fundamental problem of **autonomous agent commerce**: How can AI agents transact value safely, verify each other's work, and build lasting reputations—all on-chain?

**Three Core Pillars:**

1. **Identity** — Every agent has a verifiable on-chain identity via Kite Agent Passport (DID-based)
2. **Payments** — Agents pay each other autonomously using Kite's x402 protocol and stablecoin rails (gasless USDC)
3. **Reputation** — Agents build tamper-proof trust scores on-chain based on job history and performance

---

## Key Features

✅ **Autonomous Agent Orchestration**
- User posts a job once; agents autonomously complete it with zero human approval gates between tasks
- Groq-powered specialist agents reason, decide, and act independently

✅ **Kite Agent Passport Integration**
- Agents have verifiable DIDs (Decentralized Identifiers)
- Sessions control spending budgets (max $X over Y hours)
- Delegations enable autonomous payments

✅ **Gasless Stablecoin Payments**
- USDC transfers with zero gas tokens needed
- EIP-3009 signed messages executed by Kite's relayer infrastructure
- Instant settlement on Kite blockchain

✅ **On-Chain Reputation System**
- Agent performance recorded immutably on ReputationRegistry smart contract
- Completion rates, earnings history, and success flags tracked per agent
- Queryable from any blockchain explorer

✅ **Real-Time Dashboard**
- Live job execution monitoring
- Subtask progress with status indicators
- Payment TxHashes linked to Kite block explorer
- Agent reputation updates visible in real-time

✅ **Production-Ready**
- Frontend deployed on Vercel
- Backend deployed on Heroku/Railway with PostgreSQL
- Smart contracts deployed on Kite testnet
- Fully reproducible demo with public URLs

---

## Architecture

```
┌──────────────┐
│  Next.js      │ (Vercel)
│  Dashboard    │
└────────┬─────┘
         │ POST /jobs
         ▼
┌──────────────────────────────────────┐
│    NestJS Backend                     │ (Heroku)
│  ┌──────────────────────────────────┐ │
│  │ Job Orchestrator                 │ │
│  │ - Breaks job into subtasks       │ │
│  │ - Calls Groq for breakdown       │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ Agent Spawner                    │ │
│  │ - Runs autonomous Groq loops     │ │
│  │ - Each agent perceive→decide→act │ │
│  │ - Calls kite.pay() autonomously  │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ PostgreSQL Database              │ │
│  │ - Jobs, Subtasks, Payments       │ │
│  │ - Agent profiles, execution logs │ │
│  └──────────────────────────────────┘ │
└──────────────┬──────────────────────────┘
               │ POST /testnet (gasless)
               │ call contracts
               ▼
┌──────────────────────────────────────┐
│ Kite Agent Passport                   │
│ - Agent DIDs                          │
│ - Sessions (spending limits)          │
│ - Delegations (authorization)         │
└──────────────┬──────────────────────────┘
               │ EIP-3009 + Relayer
               ▼
┌──────────────────────────────────────┐
│ Kite Blockchain (Testnet)             │
│ - ReputationRegistry contract         │
│ - USDC gasless transfers              │
│ - On-chain settlement                 │
└──────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contracts** | Solidity 0.8+, Hardhat |
| **Contract Network** | Kite AI Testnet (ChainID: 2368) |
| **Backend** | Node.js, NestJS, TypeORM |
| **Database** | PostgreSQL |
| **Frontend** | Next.js 14+, React, TailwindCSS |
| **AI Brain** | Groq API (Llama 3) |
| **Blockchain Client** | ethers.js |
| **Payments** | Kite Agent Passport, Kite Gasless Service (EIP-3009) |
| **Deployment** | Vercel (frontend), Heroku/Railway (backend), Kite testnet (contracts) |

---

## Project Structure

```
agenthive/
├── contracts/                    # Solidity smart contracts
│   ├── contracts/
│   │   └── ReputationRegistry.sol
│   ├── test/
│   ├── scripts/
│   │   └── deploy.js
│   ├── hardhat.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/                      # NestJS API server
│   ├── src/
│   │   ├── blockchain/           # Kite & contract integration
│   │   ├── payment/              # Gasless payment service
│   │   ├── orchestrator/         # Job breakdown logic
│   │   ├── agents/               # Agent spawning
│   │   ├── jobs/                 # Job CRUD endpoints
│   │   ├── ai/                   # Groq integration
│   │   ├── database/
│   │   │   └── entities/         # TypeORM entities
│   │   └── common/               # Error handling, middleware
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                     # Next.js dashboard
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Home
│   │   ├── jobs/
│   │   │   ├── page.tsx          # Jobs list
│   │   │   ├── new/page.tsx      # Create job form
│   │   │   └── [id]/page.tsx     # Job details (live monitor)
│   │   └── agents/
│   │       ├── page.tsx          # Agents directory
│   │       └── [address]/page.tsx # Agent profile
│   ├── components/               # Reusable React components
│   ├── hooks/                    # Custom React hooks
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   ├── .env.local.example
│   └── README.md
│
├── .gitignore
├── README.md                    # This file
├── ARCHITECTURE.md              # Detailed architecture docs
└── DEPLOYMENT.md                # Production deployment guide
```

---

## Prerequisites

Ensure you have installed:

- **Node.js** (v18+): [https://nodejs.org/](https://nodejs.org/)
- **npm** (v9+): Comes with Node.js
- **Git**: [https://git-scm.com/](https://git-scm.com/)
- **PostgreSQL** (v14+): [https://www.postgresql.org/](https://www.postgresql.org/)

**Kite Testnet Access:**
- Kite RPC: `https://rpc-testnet.gokite.ai/`
- Block Explorer: `https://testnet.kitescan.ai/`
- Faucet: `https://faucet.gokite.ai/`

**API Keys Required:**
- **Groq API Key**: [https://console.groq.com/](https://console.groq.com/)

---

## Quick Start

### 1. Smart Contracts Setup

```bash
cd contracts

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your testnet deployer private key
# DEPLOYER_PRIVATE_KEY=0x...

# Compile contracts
npx hardhat compile

# Run tests
npm test

# Deploy to Kite testnet
npx hardhat run scripts/deploy.js --network kiteTestnet

# Save the ReputationRegistry contract address to backend .env
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration:
# DATABASE_URL=postgresql://user:password@localhost:5432/agenthive
# KITE_RPC=https://rpc-testnet.gokite.ai/
# REPUTATION_REGISTRY_ADDRESS=0x... (from step 1)
# GROQ_API_KEY=gsk_...
# ORCHESTRATOR_ADDRESS=0x... (your deployer wallet)

# Create PostgreSQL database
createdb agenthive

# Run database migrations
npm run typeorm migration:run

# Verify everything works
npm run start:dev
# Should print: [NestFactory] Nest application successfully started on port 3001
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your backend URL:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start development server
npm run dev
# Should print: ▲ Next.js starts on localhost:3000
```

---

## Environment Variables

### Smart Contracts (`contracts/.env`)

```env
DEPLOYER_PRIVATE_KEY=0x... # Your testnet wallet private key
```

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agenthive

# Kite Blockchain
KITE_RPC=https://rpc-testnet.gokite.ai/
REPUTATION_REGISTRY_ADDRESS=0x... # Deployed contract address
ORCHESTRATOR_ADDRESS=0x... # Backend's wallet address for contract calls
KITE_DEPLOYER_PRIVATE_KEY=0x... # Private key for signing contract txs

# AI/LLM
GROQ_API_KEY=gsk_... # Get from https://console.groq.com/

# Server
NODE_ENV=development
PORT=3001
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001 # Backend API endpoint
```

---

## Running the Application

**Terminal 1: Smart Contracts (if developing)**
```bash
cd contracts
npx hardhat node  # Optional: run local testnet
```

**Terminal 2: Backend**
```bash
cd backend
npm run start:dev
# Listens on http://localhost:3001
# GET /health should return 200 OK
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
# Open http://localhost:3000 in your browser
```

---

## Demo Scenario

**The AgentHive Demo Flow (~30 seconds):**

1. **Navigate to** `http://localhost:3000/jobs/new`

2. **Post a Job:**
   - Title: `"Analyze Ethereum market sentiment"`
   - Description: `"Fetch current ETH price data and provide investment insights"`
   - Image: Upload an ETH/USD price chart (optional for MVP)
   - Budget: `1.0 USDC`
   - Click **Post Job**

3. **Watch Orchestrator Breakdown:**
   - Job stored in PostgreSQL
   - Orchestrator calls Groq Llama 3: *"Break this job into subtasks"*
   - Groq returns 3 subtasks:
     - Image Analyzer (0.3 USDC)
     - Context Fetcher (0.4 USDC)
     - Insight Writer (0.3 USDC)

4. **Agents Execute Autonomously:**
   - **Agent 1 (Analyzer)**: Runs Groq → extracts "ETH at $2400, trending up" → autonomously calls `kite.pay(0.3 USDC)` → payment settled on Kite
   - **Agent 2 (Fetcher)**: Runs Groq → fetches CoinGecko data → `kite.pay(0.4 USDC)`
   - **Agent 3 (Writer)**: Generates market summary via Groq → `kite.pay(0.3 USDC)`

5. **Dashboard Updates in Real-Time:**
   - Subtask status: ✅ Complete
   - Payment TxHashes appear (linked to https://testnet.kitescan.ai/)
   - Agent reputation scores update on-chain
   - Navigate to `/agents` → see agents with +1 completion count

6. **Verify on Kite Explorer:**
   - Go to https://testnet.kitescan.ai/
   - Search for ReputationRegistry contract address
   - See completion records for all 3 agents

---

## API Reference

### Jobs Endpoints

**Create Job**
```
POST /jobs
Body: {
  title: string,
  description: string,
  imageUrl?: string (base64 or URL),
  budgetUSDC: number
}
Response: { jobId: uuid, status: "Pending" }
```

**List Jobs**
```
GET /jobs
Response: [{jobId, title, status, budget, createdAt}, ...]
```

**Get Job Details**
```
GET /jobs/:jobId
Response: {
  job: { jobId, title, description, ... },
  subtasks: [{taskId, status, result, agentAddress, paymentTxHash}, ...],
  payments: [{taskId, amount, txHash, status}, ...]
}
```

**Start Job Execution**
```
POST /jobs/:jobId/execute
Response: { status: "Executing", message: "..." }
```

**Get Real-Time Status**
```
GET /jobs/:jobId/status
Response: {
  job,
  subtasks,
  payments,
  overallProgress: 0-100
}
```

### Agents Endpoints

**List All Agents**
```
GET /agents
Response: [{agentId, name, reputation, completionRate, earned}, ...]
```

**Get Agent Profile**
```
GET /agents/:agentAddress
Response: {
  address,
  name,
  role,
  completionRate,
  successRate,
  totalJobsCompleted,
  totalEarned
}
```

**Get Agent Job History**
```
GET /agents/:agentAddress/history
Response: [{jobId, taskType, status, earned, timestamp}, ...]
```

### Health Check

```
GET /health
Response: { status: "ok", db: "connected", kiteRPC: "connected", timestamp }
```

---

## Testing

### Run Backend Tests

```bash
cd backend

# Unit & integration tests
npm run test

# E2E tests (requires running backend)
npm run test:e2e

# Test coverage
npm run test:cov
```

### Run Smart Contract Tests

```bash
cd contracts

# Hardhat tests
npm test

# With coverage
npm test -- --coverage
```

---

## Deployment

### Deploy Frontend to Vercel

```bash
cd frontend

# Push to GitHub
git push origin main

# Connect repo to Vercel dashboard
# Auto-deploys on push to main

# Set environment variables in Vercel:
# NEXT_PUBLIC_API_URL=https://agenthive-backend.herokuapp.com
```

**Live URL:** `https://agenthive.vercel.app/`

### Deploy Backend to Heroku

```bash
cd backend

# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create agenthive-backend

# Set environment variables
heroku config:set DATABASE_URL=...
heroku config:set KITE_RPC=https://rpc-testnet.gokite.ai/
heroku config:set REPUTATION_REGISTRY_ADDRESS=0x...
heroku config:set GROQ_API_KEY=...

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Live URL:** `https://agenthive-backend.herokuapp.com/`

### Deploy Smart Contracts

```bash
cd contracts

npx hardhat run scripts/deploy.js --network kiteTestnet
```

**Contract Explorer:** https://testnet.kitescan.ai/

---

## Known Limitations

- **Hardcoded Demo Agents**: MVP uses 3 hardcoded specialist agents (Image Analyzer, Context Fetcher, Writer). Dynamic agent discovery coming post-hackathon.
- **Sequential Subtask Execution**: Subtasks run one-by-one. Parallel execution coming soon.
- **Mock Image Analysis**: MVP uses hardcoded image parsing. Vision API integration in progress.
- **Testnet Only**: Not deployed to mainnet yet. Kite mainnet deployment after hackathon.
- **No User Wallet Connection**: Backend signs all contract txs. Frontend wallet connection coming post-hackathon.
- **Single Job Type**: MVP supports image analysis + data synthesis. Multiple job types post-hackathon.

---

## Future Roadmap

**Post-Hackathon Priorities:**

- [ ] Dynamic agent discovery & routing (agent marketplace)
- [ ] Agent-to-agent trust scores (social lending use case)
- [ ] Parallel subtask execution
- [ ] Vision API integration (Claude Vision or Groq vision)
- [ ] Multi-chain support (Arbitrum, Optimism, etc.)
- [ ] Advanced reputation scoring (Bayesian reputation, slashing)
- [ ] Dispute resolution mechanism (3-person jury)
- [ ] Agent CLI tools for autonomous operation
- [ ] Production deployment on Kite mainnet

---

## Team

**Built for the Encode Club Kite AI Global Hackathon 2026**

- Lead Developer: [Your Name]
- Architecture: [Your Name]
- Special Thanks: Kite, Groq, Encode Club

---

## License

MIT License. See LICENSE file for details.

---

## Support & Documentation

- **Architecture Deep Dive**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Backend README**: See [backend/README.md](./backend/README.md)
- **Frontend README**: See [frontend/README.md](./frontend/README.md)
- **Smart Contracts README**: See [contracts/README.md](./contracts/README.md)

---

---

## Resources & References

### Kite Blockchain & Agent Passport

- **Kite Documentation**: https://docs.gokite.ai/
- **Agent Passport Intro**: https://docs.gokite.ai/kite-agent-passport/kite-agent-passport
- **Agent Passport Developer Guide**: https://docs.gokite.ai/kite-agent-passport/developer-guide
- **Kite Gasless Integration**: https://docs.gokite.ai/kite-chain/9-gasless-integration
- **Network Information (Testnet RPC, Faucet)**: https://docs.gokite.ai/kite-chain/1-getting-started/network-information
- **Kite Testnet Block Explorer**: https://testnet.kitescan.ai/
- **Kite Testnet Faucet**: https://faucet.gokite.ai/
- **Kite Agent Passport Portal**: https://x402-portal-eight.vercel.app/

### Smart Contracts & Blockchain Development

- **Solidity Documentation**: https://docs.soliditylang.org/
- **Hardhat Documentation**: https://hardhat.org/docs
- **Hardhat Tutorials**: https://hardhat.org/tutorial
- **ethers.js v6 Documentation**: https://docs.ethers.org/v6/
- **EIP-3009 (Gasless Transfers)**: https://eips.ethereum.org/EIPS/eip-3009
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts/

### Backend Development

- **NestJS Documentation**: https://docs.nestjs.com/
- **NestJS Getting Started**: https://docs.nestjs.com/first-steps
- **TypeORM Documentation**: https://typeorm.io/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Node.js Documentation**: https://nodejs.org/docs/

### AI/LLM Integration

- **Groq API Documentation**: https://console.groq.com/docs
- **Groq API Keys**: https://console.groq.com/keys
- **Groq SDK (Node.js)**: https://www.npmjs.com/package/@groq/sdk
- **Llama 3 Model Card**: https://huggingface.co/meta-llama/Llama-3-8b

### Frontend Development

- **Next.js Documentation**: https://nextjs.org/docs
- **Next.js App Router Guide**: https://nextjs.org/docs/app
- **React Documentation**: https://react.dev/
- **TailwindCSS Documentation**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

### Deployment

- **Vercel Documentation**: https://vercel.com/docs
- **Heroku Deployment Guide**: https://devcenter.heroku.com/articles/getting-started-with-nodejs
- **Railway Documentation**: https://docs.railway.app/
- **PostgreSQL on Railway**: https://docs.railway.app/databases/postgresql
- **Environment Variables in Vercel**: https://vercel.com/docs/environment-variables

### Encode Club & Hackathon

- **Encode Club**: https://www.encodeclub.com/
- **Encode Club Kite Hackathon**: https://www.encodeclub.com/my-programmes/kites-hackathon-ai-agentic-economy
- **Encode Club Discord**: https://discord.gg/BsPbaShcxv

### Additional Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub**: https://github.com/
- **npm Registry**: https://www.npmjs.com/
- **Model Context Protocol (MCP)**: https://modelcontextprotocol.io/
- **EIP-712 (Typed Structured Data Hashing)**: https://eips.ethereum.org/EIPS/eip-712

### Troubleshooting Guides

| Issue | Resource |
|-------|----------|
| Hardhat compilation errors | https://hardhat.org/hardhat-runner/docs/getting-started |
| PostgreSQL connection issues | https://www.postgresql.org/docs/current/static/libpq-envars.html |
| Next.js build errors | https://nextjs.org/docs/messages/ompilation-error |
| Groq API rate limits | https://console.groq.com/docs/limits |
| Kite RPC connection issues | https://docs.gokite.ai/kite-chain/1-getting-started |
| ethers.js TypeScript errors | https://docs.ethers.org/v6/getting-started/ |

---

**Questions? Open an issue or check the documentation links above.**

**Ready to build the agentic economy? 🚀**
