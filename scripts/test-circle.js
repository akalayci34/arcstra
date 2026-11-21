require("dotenv").config({ path: ".env", override: true });

const axios = require("axios");

const key = process.env.CIRCLE_API_KEY;

console.log("KEY EXISTS:", !!key);

if (!key) {
  throw new Error("CIRCLE_API_KEY missing");
}

// Debug (gizli karakterleri gör)
console.log("KEY PREVIEW:", key?.slice(0, 10) + "...");

const api = axios.create({
  baseURL: "https://api.circle.com",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  }
});

async function run() {
  try {
    // ⚠️ Burayı gerçek wallet id ile değiştir
    const walletId = process.env.CIRCLE_WALLET_ID;

    const result = await api.get(
      `/v1/w3s/wallets/${walletId}/balances`
    );

    console.log("CONNECTED ✅");
    console.log(JSON.stringify(result.data, null, 2));

  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data || err.message);
  }
}

run();