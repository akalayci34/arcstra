# ARCSTRA_MASTER_MEMORY.md

## Project Identity

**Project Name:** ARCSTRA

**Category:** Circle-Native Financial Infrastructure

**Positioning:**
ARCSTRA is a Circle-native financial orchestration platform designed to transform wallet infrastructure into programmable financial systems through event-driven architecture, transaction orchestration, and real-time ledger tracking.

Core vision:

> Wallets are not static objects.
> Wallets are financial event streams.

ARCSTRA sits between application developers and blockchain infrastructure, providing orchestration, observability, and operational tooling.

---

# Origin Story

The project originated from practical difficulties encountered while integrating Circle Wallet Infrastructure and blockchain applications.

During development, multiple recurring challenges emerged:

* Wallet lifecycle complexity
* Operational visibility gaps
* Transaction orchestration requirements
* Lack of reusable financial infrastructure
* Repeated backend engineering work across projects

These recurring patterns led to the creation of ARCSTRA as an orchestration layer above Circle Wallet Infrastructure.

---

# Development History

## Initial Focus

Original work began around:

* Circle Developer-Controlled Wallets
* Circle Wallet Infrastructure
* Arc ecosystem exploration
* Wallet automation
* Transaction workflows

The initial objective was not a SaaS platform.

The SaaS and orchestration concepts emerged after repeated infrastructure challenges were identified.

---

# Critical Lessons Learned

## Circle API Credentials

One major discovery:

Generating new API credentials unnecessarily can break previously functioning integrations.

Important lesson:

Do not rotate API credentials unless required.

Always verify:

* API Key
* Entity Secret
* Ciphertext
* Recovery files

before assuming a credential issue.

---

## Entity Secret Recovery

A major milestone was understanding the relationship between:

* ENTITY_SECRET
* ENTITY_SECRET_CIPHERTEXT
* Recovery files

Important realization:

Entity Secret recovery is possible using:

* Recovery file
* Ciphertext
* Original recovery information

This became an important operational lesson during Circle integration debugging.

---

# Circle Integration Status

## Current Status

Circle Wallet integration is partially implemented.

Current state:

* Circle account established
* Test environment configured
* Wallet integration architecture defined
* Wallet creation workflow under development

Current integration target:

Circle Wallet Infrastructure

Current Circle products:

* Wallets

Planned Circle products:

* Wallets
* USDC

Potential future evaluation:

* Bridge Kit

No production integration currently exists.

---

# Arc Ecosystem Status

Current chain focus:

Arc

Current environment:

Arc testnet

Project positioning:

Arc-first financial infrastructure layer.

---

# Repository Structure

Current repository structure:

apps/
api/
web/
worker/

packages/
circle/
db/
queue/

docs/
architecture.md
flow.md

Root:

README.md
package.json
docker-compose.yml
.env
.gitignore

---

# Current Architecture

High-level architecture:

User
↓
Dashboard
↓
API Gateway
↓
Wallet Service
(Circle)

↓

Event Queue
(Redis)

↓

Worker Engine

↓

Ledger

↓

Blockchain

Design principle:

Everything is an event.

---

# API Development Progress

## Working Components

Health endpoint:

GET /

Response:

{
"ok": true,
"service": "arc-wallet-api"
}

---

## Wallet Endpoint

Current target endpoint:

POST /wallet/create

Current state:

Mock wallet generation implemented.

Future state:

Real Circle Wallet creation.

---

# Technical Stack

Backend:

* Node.js

Frontend:

* Next.js (planned)

Infrastructure:

* Redis
* PostgreSQL

Queue:

* BullMQ (planned)

External Infrastructure:

* Circle Wallets

Deployment:

* Docker
* Kubernetes-ready architecture

---

# Development Environment Lessons

## PowerShell Notes

Windows PowerShell behaves differently from Linux shell examples.

Example:

This fails:

curl -X POST http://localhost:3001/wallet/create

Because PowerShell aliases curl to Invoke-WebRequest.

Preferred approaches:

curl.exe

or

Invoke-RestMethod

---

## Server Debugging Lessons

A major issue encountered:

ReferenceError: app is not defined

Cause:

Route definitions were added before Express initialization.

Correct order:

1. Import dependencies
2. Create Express app
3. Register middleware
4. Register routes
5. Start server

---

## Stable Local Run Command

Current standard command:

npm run dev

Expected result:

Server starts on:

http://127.0.0.1:3001

---

# Grant Strategy

## Grant Target

Circle Grants Program

Positioning:

Circle-native financial orchestration platform.

Not:

* AI civilization platform
* Ontology project
* Universal intelligence framework

Those concepts remain narrative and vision layers only.

---

# Core Grant Narrative

Problem:

Wallet infrastructure exists, but orchestration infrastructure is missing.

Solution:

ARCSTRA provides:

* Wallet orchestration
* Event-driven transactions
* Real-time ledger
* Developer dashboard

Impact:

Faster developer adoption of Circle infrastructure.

---

# Grant Milestones

Milestone 1

Wallet Infrastructure Foundation

Weeks 1–3

Circle Products:

* Wallets

---

Milestone 2

Transaction Orchestration

Weeks 4–6

Circle Products:

* Wallets
* USDC

---

Milestone 3

Financial Ledger

Weeks 7–9

Circle Products:

* Wallets
* USDC

---

Milestone 4

Dashboard + Public MVP

Weeks 10–12

Circle Products:

* Wallets
* USDC

---

# Investor Narrative

Positioning:

"The Operating System for Programmable Finance."

ARCSTRA extends Circle rather than replacing it.

Mission:

Transform wallets into programmable financial systems.

---

# Landing Page Narrative

Headline:

The Operating System for Programmable Finance

Subheadline:

Build, orchestrate, and monitor programmable financial workflows powered by Circle Wallet Infrastructure.

---

# GitHub System Truth

ARCSTRA is a Circle-native financial orchestration layer.

Current Status:

* MVP in development
* Circle Wallet integration in progress
* Arc-first roadmap
* Event-driven architecture
* Real-time ledger planned

Source of Truth:

* docs/ARCSTRA_MASTER_MEMORY.md
* docs/architecture.md
* docs/flow.md

---

# Current Development Priorities

Priority 1

Real Circle wallet creation endpoint.

Target:

POST /wallet/create

using Circle Wallet APIs.

---

Priority 2

Transaction orchestration layer.

---

Priority 3

Redis event queue.

---

Priority 4

Ledger implementation.

---

Priority 5

Developer dashboard.

---

# Important Rule For Future AI Agents

Do not assume production readiness.

Current reality:

* MVP stage
* Architecture defined
* Initial backend running
* Circle integration underway
* No production users
* No production transaction volume
* No MAU
* No AUM

All grant, investor, and documentation materials must remain consistent with these facts.

---

# Current State Summary

ARCSTRA is an early-stage Circle-native financial orchestration platform being built on Arc.

The architecture is defined.

The repository structure exists.

The backend foundation is operational.

Circle Wallet integration is underway.

The immediate goal is a public MVP demonstrating:

Wallet Creation
→ Transaction
→ Event Processing
→ Ledger Update
→ Dashboard Visibility

This workflow represents the project's first complete end-to-end milestone.
