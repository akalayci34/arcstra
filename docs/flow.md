# ARCSTRA Flow Documentation

## Wallet Creation Flow

User
↓
POST /wallet/create
↓
Circle Wallet API
↓
Wallet Created
↓
Wallet ID Returned
↓
Wallet Stored

---

## Transaction Flow

User
↓
Create Transaction
↓
API Validation
↓
Event Created
↓
Queue Job Created
↓
Worker Executes
↓
Circle Transaction
↓
Blockchain Confirmation
↓
Ledger Updated
↓
Dashboard Updated

---

## Future USDC Flow

User
↓
Send USDC
↓
Transaction Event
↓
Queue
↓
Worker
↓
Circle Execution
↓
Confirmation
↓
Ledger Update

---

## Future Treasury Flow

Business Wallet
↓
Treasury Rules
↓
Automation Engine
↓
Circle Wallets
↓
Settlement
↓
Ledger

---

## End-to-End MVP Goal

Create Wallet
↓
Create Event
↓
Process Event
↓
Execute Transaction
↓
Update Ledger
↓
Update Dashboard

This represents the first complete ARCSTRA workflow.
