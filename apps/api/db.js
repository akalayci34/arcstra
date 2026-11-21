// apps/api/db.js - ARCSTRA PostgreSQL Kalıcılık Katmanı
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PG_HOST || process.env.PGHOST || "postgres",
  port: process.env.PG_PORT || process.env.PGPORT || 5432,
  user: process.env.PG_USER || process.env.PGUSER || "arcstra",
  password: process.env.PG_PASSWORD || process.env.PGPASSWORD || "arcstra123",
  database: process.env.PG_DATABASE || process.env.PGDATABASE || "arcstra",
});

async function initDB() {
  while (true) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ledger (
          id TEXT PRIMARY KEY,
          time TIMESTAMPTZ NOT NULL,
          event_type TEXT NOT NULL,
          data JSONB NOT NULL
        );
        CREATE TABLE IF NOT EXISTS wallets (
          id TEXT PRIMARY KEY,
          owner TEXT NOT NULL,
          balance NUMERIC NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL
        );
        CREATE TABLE IF NOT EXISTS treasury (
          chain TEXT PRIMARY KEY,
          network TEXT NOT NULL,
          balances JSONB NOT NULL,
          locked NUMERIC NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS escrows (
          id TEXT PRIMARY KEY,
          chain TEXT NOT NULL,
          app TEXT NOT NULL,
          task_id TEXT NOT NULL,
          to_wallet_id TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          status TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );
      `);

      // Başlangıç zincir kasaları yoksa oluştur
      await pool.query(`
        INSERT INTO treasury (chain, network, balances, locked)
        VALUES 
          ('SOL', 'devnet', '{"SOL": 0, "USDC": 0}'::jsonb, 0),
          ('ETH', 'sepolia', '{"ETH": 0, "USDC": 0}'::jsonb, 0)
        ON CONFLICT (chain) DO NOTHING;
      `);

      console.log("Connected to PostgreSQL & tablolar hazır");
      break;
    } catch (err) {
      console.log("Waiting for PostgreSQL...", err.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

module.exports = { pool, initDB };
