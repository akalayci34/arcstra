require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

const BASE_URL = "https://api.circle.com/v1/w3s";

/**
 * REAL Circle wallet creation (Developer Controlled Wallets)
 */
async function createWallet() {
  try {
    const idempotencyKey = crypto.randomUUID();

    const body = {
      idempotencyKey,
      entitySecretCiphertext: process.env.CIRCLE_ENTITY_SECRET_CIPHERTEXT
    };

    const res = await axios.post(
      `${BASE_URL}/developer/wallets`,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      walletId: res.data.data.walletId,
      status: res.data.data.status || "created"
    };

  } catch (err) {
    console.error("❌ Circle API Error:");
    console.error(err.response?.data || err.message);

    throw err;
  }
}

module.exports = {
  createWallet
};