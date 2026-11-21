# ARCSTRA Architecture

## Overview

ARCSTRA is a Circle-native financial orchestration layer designed to transform wallets into programmable financial systems.

The platform follows an event-driven architecture.

## High-Level Architecture

User
↓
Web Dashboard
↓
API Layer
↓
Wallet Service (Circle)
↓
Event Queue
↓
Worker Engine
↓
Ledger
↓
Blockchain

## Components

### apps/api

Responsibilities:

* REST API
* Wallet management
* Transaction orchestration
* Event creation

### apps/web

Responsibilities:

* Dashboard
* Wallet management UI
* Activity monitoring
* Analytics

### apps/worker

Responsibilities:

* Queue consumption
* Event execution
* Transaction processing

### packages/circle

Responsibilities:

* Circle SDK integration
* Wallet creation
* Wallet retrieval
* Transaction execution

### packages/db

Responsibilities:

* PostgreSQL access
* Ledger storage
* Wallet storage

### packages/queue

Responsibilities:

* Redis queue
* Job creation
* Event distribution

## Event Flow

Wallet Event
→ Queue
→ Worker
→ Blockchain
→ Ledger
→ Dashboard

## Design Principles

* Event-driven
* Modular
* Multi-chain ready
* Circle-native
* Production-observable
* Infrastructure-first

## Future Expansion

* USDC settlement
* Real-time treasury operations
* Multi-wallet orchestration
* Automated financial workflows
* Enterprise dashboard
