# ARCSTRA Architecture Manifest
Version: 1.0
Project: upland-arc-bridge

---

# Purpose

ARCSTRA is composed of TWO independent systems.

These systems may communicate with each other,
but they must never be merged accidentally.

---

# SYSTEM A
# ARCSTRA Economy Engine

Location:

core/

Structure:

core/
├─ agents
├─ finance
├─ intents
├─ ledger
├─ marketplace
├─ orchestration
├─ tasks

Purpose:

Agent Economy

Flow:

Task
→ Intent
→ Orchestrator
→ Payment
→ Ledger
→ Reputation

Primary Data:

data/
├─ intents.json
├─ ledger.json
├─ reputation.json
├─ agents.json

Core Components:

core/agents/reputationEngine.js
core/finance/paymentExecutor.js
core/intents/intentManager.js
core/ledger/ledger.js
core/marketplace/marketplaceEngine.js
core/orchestration/orchestrator.js

---

# SYSTEM B
# Event Stream OS

Location:

apps/api/

Structure:

apps/api/src/
├─ events
├─ graph
├─ services
├─ api
├─ admin
├─ controllers

Purpose:

Observability
Streaming
Fraud Detection
Routing
Analytics

Core Components:

apps/api/src/events/event.bus.js
apps/api/src/events/event.store.js
apps/api/src/services/graph/eventGraph.service.js
apps/api/src/services/fraud/
apps/api/src/services/ai-routing/

---

# DESIGN RULES

Rule 1

Never move files from:

core/

into:

apps/api/

Rule 2

Never move files from:

apps/api/

into:

core/

Rule 3

All cross-system communication must happen through:

EventBus

or

API endpoints

Never through direct file imports.

BAD:

core/*
require("../../apps/api/...")

GOOD:

eventBus.publish(...)
HTTP API
WebSocket Stream

---

# CURRENT STATUS

Economy Engine:
WORKING

Event Stream OS:
UNDER REPAIR

Latest Progress:

✓ event.bus rebuilt
✓ event.store rebuilt
✓ websocket stream fixed
✓ graph engine restored
✓ ai routing engine repaired

Remaining work:

□ apps/api/index.js dependency cleanup
□ webhook bootstrap repair
□ routing layer validation
□ end-to-end transaction test

---

# LONG TERM ROADMAP

Phase 1
Restore API startup

Phase 2
Validate:

Intent
→ Payment
→ Ledger
→ Reputation

Phase 3
Leaderboard

Phase 4
Heatmap

Phase 5
Whale Detection

Phase 6
Circle USDC Live Transactions

Phase 7
Economic Intelligence Dashboard

---

# GOLDEN RULE

If a file import path starts looking strange:

STOP.

Verify whether the file belongs to:

A) Economy Engine

or

B) Event Stream OS

before changing architecture.