require("dotenv").config();
const crypto = require("crypto");

const CIRCLE_BASE_URL = "https://api.circle.com";

async function main() {
  try {
    const apiKey = process.env.CIRCLE_API_KEY;
    const walletSetId = process.env.WALLET_SET_ID;

    if (!apiKey) throw new Error("CIRCLE_API_KEY missing");
    if (!walletSetId) throw new Error("WALLET_SET_ID missing");

    console.log("=================================");
    console.log("🚀 Creating Wallet...");
    console.log("=================================");

    console.log("Wallet Set ID:", walletSetId);

    const idempotencyKey = crypto.randomUUID();

    const response = await fetch(
      `${CIRCLE_BASE_URL}/v1/w3s/developer/wallets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotencyKey,
          walletSetId,
          blockchains: ["ETH"], // 🔥 EVM chain (Arc için base)
          count: 1,
        }),
      }
    );

    let data;
    try {
      data = await response.json();
    } catch {
      data = { raw: await response.text() };
    }

    console.log("STATUS:", response.status);
    console.log("=================================");
    console.log("📦 RESPONSE");
    console.log(JSON.stringify(data, null, 2));
    console.log("=================================");

    if (!response.ok) {
      console.error("❌ Circle API error");
      return;
    }

    const wallet = data?.data?.wallets?.[0];

    if (wallet) {
      console.log("=================================");
      console.log("🎯 WALLET CREATED");
      console.log("Wallet ID:", wallet.id);
      console.log("Address:", wallet.address);
      console.log("Blockchain:", wallet.blockchain);
      console.log("=================================");

      // Save to .env (optional)
      const fs = require("fs");

      fs.appendFileSync(
        ".env",
        `\nWALLET_ID=${wallet.id}\nWALLET_ADDRESS=${wallet.address}\n`
      );

      console.log("💾 Saved wallet info to .env");
    } else {
      console.log("⚠️ No wallet returned");
    }
  } catch (err) {
    console.error("=================================");
    console.error("❌ ERROR");
    console.error(err.message || err);
    console.error("=================================");
  }
}

main();