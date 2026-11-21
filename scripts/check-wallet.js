require("dotenv").config();

async function main() {
  try {
    // =========================
    // 🔍 ENV DEBUG (CRITICAL)
    // =========================
    console.log("=================================");
    console.log("🔍 ENV DEBUG");
    console.log("=================================");

    console.log({
      CIRCLE_API_KEY: process.env.CIRCLE_API_KEY ? "OK" : "MISSING",
      CIRCLE_WALLET_ID: process.env.CIRCLE_WALLET_ID || "MISSING",
      CIRCLE_WALLET_SET_ID: process.env.CIRCLE_WALLET_SET_ID || "MISSING",
      CIRCLE_WALLET_ADDRESS: process.env.CIRCLE_WALLET_ADDRESS || "MISSING",
    });

    const walletId = process.env.CIRCLE_WALLET_ID;
    const apiKey = process.env.CIRCLE_API_KEY;

    // =========================
    // ❌ VALIDATION
    // =========================
    if (!apiKey) {
      throw new Error("CIRCLE_API_KEY missing");
    }

    if (!walletId) {
      throw new Error("CIRCLE_WALLET_ID missing");
    }

    // =========================
    // 🚀 API CALL
    // =========================
    console.log("=================================");
    console.log("🔍 Checking Wallet...");
    console.log("=================================");

    const response = await fetch(
      `https://api.circle.com/v1/w3s/wallets/${walletId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("STATUS:", response.status);

    const data = await response.json();

    console.log("=================================");
    console.log("📦 RESPONSE");
    console.log("=================================");
    console.log(JSON.stringify(data, null, 2));

    // =========================
    // ⚠️ API ERROR HANDLING
    // =========================
    if (!response.ok) {
      console.log("=================================");
      console.log("❌ API ERROR");
      console.log("=================================");
      console.log(data);
    }
  } catch (err) {
    console.log("=================================");
    console.log("❌ FATAL ERROR");
    console.log("=================================");
    console.log(err.message || err);
  }
}

main();