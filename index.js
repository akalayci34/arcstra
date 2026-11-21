const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { pool, initDB } = require("./db");
const { Connection, clusterApiUrl } = require("@solana/web3.js");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
// CORS - Dashboard başka porttan da çalışsın diye
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Dashboard static dosyası
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000;
const solConnection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Dashboard sayfası
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
initDB();

async function addLedger(event) {
  const id = "txn_" + crypto.randomUUID().slice(0, 8);
  const time = new Date().toISOString();
  const { event_type, ...rest } = event;
  await pool.query("INSERT INTO ledger (id, time, event_type, data) VALUES ($1, $2, $3, $4)", [id, time, event_type, JSON.stringify(rest)]);
  return { id, time, event_type, ...rest };
}

app.get("/", (req, res) => res.send("ARCSTRA Economic Operating System v3.1"));

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    res.json({ status: "healthy", database: "connected", serverTime: result.rows[0].now });
  } catch (err) { res.status(500).json({ status: "error", database: "disconnected" }); }
});

app.post("/wallet/create", async (req, res) => {
  try {
    const { owner } = req.body;
    if (!owner) return res.status(400).json({ error: "owner gerekli" });
    const id = "w_" + crypto.randomUUID().slice(0, 8);
    const createdAt = new Date().toISOString();
    await pool.query("INSERT INTO wallets (id, owner, balance, created_at) VALUES ($1, $2, 0, $3)", [id, owner, createdAt]);
    await addLedger({ event_type: "WALLET_CREATED", walletId: id, owner });
    res.json({ id, owner, balance: 0, createdAt });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/wallet/balance/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, balance FROM wallets WHERE id = $1", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "cüzdan bulunamadı" });
    res.json({ id: rows[0].id, balance: Number(rows[0].balance) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/wallet/transfer", async (req, res) => {
  const client = await pool.connect();
  try {
    const { fromWalletId, toWalletId, amount } = req.body;
    if (!fromWalletId || !toWalletId) return res.status(400).json({ error: "from / to gerekli" });
    if (fromWalletId === toWalletId) return res.status(400).json({ error: "aynı cüzdana transfer olmaz" });
    if (typeof amount !== "number" || amount <= 0) return res.status(400).json({ error: "amount > 0 olmalı" });

    await client.query("BEGIN");
    const fromRes = await client.query("SELECT balance FROM wallets WHERE id = $1 FOR UPDATE", [fromWalletId]);
    if (fromRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ error: "gönderen cüzdan yok" }); }
    const toRes = await client.query("SELECT balance FROM wallets WHERE id = $1 FOR UPDATE", [toWalletId]);
    if (toRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ error: "alıcı cüzdan yok" }); }

    const fromBalance = Number(fromRes.rows[0].balance);
    if (fromBalance < amount) { await client.query("ROLLBACK"); return res.status(400).json({ error: "bakiye yetersiz" }); }

    const newFromBalance = fromBalance - amount;
    await client.query("UPDATE wallets SET balance = $1 WHERE id = $2", [newFromBalance, fromWalletId]);
    await client.query("UPDATE wallets SET balance = balance + $1 WHERE id = $2", [amount, toWalletId]);
    await client.query("COMMIT");

    const entry = await addLedger({ event_type: "SETTLEMENT_CONFIRMED", fromWalletId, toWalletId, amount });
    res.json({ ok: true, ledger: entry, fromBalance: newFromBalance });
  } catch (err) { await client.query("ROLLBACK"); res.status(500).json({ error: err.message }); }
  finally { client.release(); }
});
async function getTreasuryState() {
  const tRes = await pool.query("SELECT chain, network, balances, locked FROM treasury");
  const eRes = await pool.query("SELECT * FROM escrows ORDER BY created_at ASC");
  const chains = {};
  for (const row of tRes.rows) chains[row.chain] = { network: row.network, balances: row.balances, locked: Number(row.locked) };
  const escrows = eRes.rows.map(r => ({
    id: r.id, chain: r.chain, app: r.app, taskId: r.task_id,
    toWalletId: r.to_wallet_id, amount: Number(r.amount), status: r.status, createdAt: r.created_at
  }));
  return { chains, escrows };
}

app.get("/treasury", async (req, res) => {
  try { res.json(await getTreasuryState()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/treasury/deposit", async (req, res) => {
  try {
    const { chain = "SOL", token, amount, txHash } = req.body;
    if (!["SOL", "ETH", "USDC", "EURC"].includes(token)) return res.status(400).json({ error: "geçersiz token" });
    if (typeof amount !== "number" || amount <= 0) return res.status(400).json({ error: "amount > 0 olmalı" });

    if (chain === "SOL" && txHash && !txHash.startsWith("test-tx")) {
      const dup = await pool.query("SELECT id FROM ledger WHERE event_type = 'TREASURY_DEPOSIT' AND data->>'txHash' = $1", [txHash]);
      if (dup.rows.length > 0) return res.status(400).json({ error: "Bu txHash zaten kullanılmış" });
      const tx = await solConnection.getTransaction(txHash, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
      if (!tx) return res.status(400).json({ error: "Devnet üzerinde böyle bir tx yok" });
      if (tx.meta && tx.meta.err) return res.status(400).json({ error: "Tx başarısız olmuş" });
    }

    const { rows } = await pool.query("SELECT balances FROM treasury WHERE chain = $1", [chain]);
    if (rows.length === 0) return res.status(400).json({ error: "desteklenmeyen chain" });
    const balances = rows[0].balances;
    balances[token] = (Number(balances[token]) || 0) + amount;
    await pool.query("UPDATE treasury SET balances = $1 WHERE chain = $2", [JSON.stringify(balances), chain]);
    await addLedger({ event_type: "TREASURY_DEPOSIT", chain, token, amount, txHash: txHash || "test-tx" });
    res.json({ ok: true, treasury: await getTreasuryState() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/treasury/escrow", async (req, res) => {
  const client = await pool.connect();
  try {
    const { chain = "SOL", taskId, toWalletId, amount, app: appName = "core" } = req.body;
    if (!taskId || !toWalletId) return res.status(400).json({ error: "taskId ve toWalletId gerekli" });
    if (typeof amount !== "number" || amount <= 0) return res.status(400).json({ error: "amount > 0 olmalı" });
    await client.query("BEGIN");
    const tRes = await client.query("SELECT balances, locked FROM treasury WHERE chain = $1 FOR UPDATE", [chain]);
    if (tRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(400).json({ error: "desteklenmeyen chain" }); }
    const wRes = await client.query("SELECT id FROM wallets WHERE id = $1", [toWalletId]);
    if (wRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ error: "alıcı cüzdan yok" }); }
    const balances = tRes.rows[0].balances;
    if ((Number(balances.USDC) || 0) < amount) { await client.query("ROLLBACK"); return res.status(400).json({ error: "hazinede yeterli USDC yok" }); }
    balances.USDC = Number(balances.USDC) - amount;
    await client.query("UPDATE treasury SET balances = $1, locked = locked + $2 WHERE chain = $3", [JSON.stringify(balances), amount, chain]);
    const id = "esc_" + crypto.randomUUID().slice(0, 8);
    const createdAt = new Date().toISOString();
    await client.query("INSERT INTO escrows (id, chain, app, task_id, to_wallet_id, amount, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, 'LOCKED', $7)", [id, chain, appName, taskId, toWalletId, amount, createdAt]);
    await client.query("COMMIT");
    const escrow = { id, chain, app: appName, taskId, toWalletId, amount, status: "LOCKED", createdAt };
    await addLedger({ event_type: "ESCROW_LOCKED", escrowId: id, chain, app: appName, taskId, toWalletId, amount });
    res.json({ ok: true, escrow });
  } catch (err) { await client.query("ROLLBACK"); res.status(500).json({ error: err.message }); }
  finally { client.release(); }
});

app.post("/treasury/release", async (req, res) => {
  const client = await pool.connect();
  try {
    const { escrowId, approved } = req.body;
    if (approved !== true) return res.status(400).json({ error: "approved=true gerekli" });
    await client.query("BEGIN");
    const eRes = await client.query("SELECT * FROM escrows WHERE id = $1 FOR UPDATE", [escrowId]);
    if (eRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ error: "escrow bulunamadı" }); }
    const row = eRes.rows[0];
    if (row.status !== "LOCKED") { await client.query("ROLLBACK"); return res.status(400).json({ error: "escrow zaten çözülmüş: " + row.status }); }
    const amount = Number(row.amount);
    await client.query("UPDATE escrows SET status = 'RELEASED' WHERE id = $1", [escrowId]);
    await client.query("UPDATE treasury SET locked = locked - $1 WHERE chain = $2", [amount, row.chain]);
    const wRes = await client.query("UPDATE wallets SET balance = balance + $1 WHERE id = $2 RETURNING balance", [amount, row.to_wallet_id]);
    await client.query("COMMIT");
    const escrow = { id: row.id, chain: row.chain, app: row.app, taskId: row.task_id, toWalletId: row.to_wallet_id, amount, status: "RELEASED", createdAt: row.created_at };
    await addLedger({ event_type: "ESCROW_RELEASED", escrowId, chain: row.chain, toWalletId: row.to_wallet_id, amount });
    res.json({ ok: true, escrow, newBalance: Number(wRes.rows[0].balance) });
  } catch (err) { await client.query("ROLLBACK"); res.status(500).json({ error: err.message }); }
  finally { client.release(); }
});

app.post("/treasury/refund", async (req, res) => {
  const client = await pool.connect();
  try {
    const { escrowId } = req.body;
    await client.query("BEGIN");
    const eRes = await client.query("SELECT * FROM escrows WHERE id = $1 FOR UPDATE", [escrowId]);
    if (eRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ error: "escrow bulunamadı" }); }
    const row = eRes.rows[0];
    if (row.status !== "LOCKED") { await client.query("ROLLBACK"); return res.status(400).json({ error: "escrow zaten çözülmüş" }); }
    const amount = Number(row.amount);
    const tRes = await client.query("SELECT balances FROM treasury WHERE chain = $1 FOR UPDATE", [row.chain]);
    const balances = tRes.rows[0].balances;
    balances.USDC = Number(balances.USDC) + amount;
    await client.query("UPDATE escrows SET status = 'REFUNDED' WHERE id = $1", [escrowId]);
    await client.query("UPDATE treasury SET locked = locked - $1, balances = $2 WHERE chain = $3", [amount, JSON.stringify(balances), row.chain]);
    await client.query("COMMIT");
    const escrow = { id: row.id, chain: row.chain, app: row.app, taskId: row.task_id, toWalletId: row.to_wallet_id, amount, status: "REFUNDED", createdAt: row.created_at };
    await addLedger({ event_type: "ESCROW_REFUNDED", escrowId, chain: row.chain, amount });
    res.json({ ok: true, escrow });
  } catch (err) { await client.query("ROLLBACK"); res.status(500).json({ error: err.message }); }
  finally { client.release(); }
});

app.get("/ledger", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, time, event_type, data FROM ledger ORDER BY time ASC");
    res.json(rows.map(r => ({ id: r.id, time: r.time, event_type: r.event_type, ...r.data })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/test/reset", async (req, res) => {
  if (process.env.NODE_ENV === "production") return res.status(403).json({ error: "Canlı ortamda reset kapalıdır." });
  try {
    await pool.query("TRUNCATE TABLE ledger, wallets, escrows");
    await pool.query(`UPDATE treasury SET balances = '{"SOL": 0, "USDC": 0}'::jsonb, locked = 0 WHERE chain = 'SOL'; UPDATE treasury SET balances = '{"ETH": 0, "USDC": 0, "EURC": 0}'::jsonb, locked = 0 WHERE chain = 'ETH';`);
    res.json({ ok: true, message: "PostgreSQL test verileri sıfırlandı." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log("ARCSTRA API v3.1 (PostgreSQL + Solana Devnet) listening on port " + PORT));
