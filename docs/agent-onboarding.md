# ARCSTRA Agent Onboarding

## Read First

Before doing any work, read:

1. ARCSTRA_MASTER_MEMORY.md
2. architecture.md
3. flow.md

These files are the project's source of truth.

---

## Project Summary

ARCSTRA is a Circle-native financial orchestration platform.

Mission:

Transform wallets into programmable financial systems.

---

## Current Stage

Status:

Early MVP

What Exists:

* Repository structure
* API service
* Circle integration package
* Documentation system
* Grant materials

What Does Not Exist Yet:

* Production deployment
* Production users
* Production transaction volume
* Production ledger

---

## Repository Structure

apps/

* api
* web
* worker

packages/

* circle
* db
* queue

docs/

* ARCSTRA_MASTER_MEMORY.md
* architecture.md
* flow.md
* grant-application.md
* investor-deck.md

---

## Current Development Priority

Priority 1

Real Circle Wallet Creation

Endpoint:

POST /wallet/create

---

Priority 2

Wallet Storage Layer

---

Priority 3

Redis Queue

---

Priority 4

Worker Engine

---

Priority 5

Ledger System

---

## Development Commands

Run API:

npm run dev

Run wallet checks:

npm run wallet

Create wallet:

npm run create-wallet

Debug environment:

npm run debug-env

---

## Critical Rules

Never claim:

* Production users
* Production volume
* Production revenue

unless independently verified.

Current reality:

* MVP
* Circle integration in progress
* Arc-first roadmap
* Early-stage infrastructure project

---

## Long-Term Vision

ARCSTRA becomes the orchestration layer between:

Applications
↓
Circle Wallet Infrastructure
↓
Blockchain Networks

providing programmable finance infrastructure at scale.
