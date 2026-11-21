require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { subtle } = require("crypto").webcrypto;

const CIRCLE_BASE_URL = "https://api.circle.com";

/* =========================
   HELPERS
========================= */

function pemToArrayBuffer(pem) {
  const cleaned = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "");

  const buffer = Buffer.from(cleaned, "base64");

  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
}

async function encryptEntitySecret(entitySecret, publicKeyPem) {
  const publicKeyBuffer = pemToArrayBuffer(publicKeyPem);

  const publicKey = await subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encoded = new TextEncoder().encode(entitySecret);

  const encrypted = await subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encoded
  );

  return Buffer.from(encrypted).toString("base64");
}

async function getPublicKey(apiKey) {
  const res = await fetch(
    `${CIRCLE_BASE_URL}/v1/w3s/config/entity/publicKey`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  const data = await res.json();

  if (!data?.data?.publicKey) {
    console.error(data);
    throw new Error("Failed to fetch public key");
  }

  return data.data.publicKey;
}

/* =========================
   MAIN FLOW
========================= */

async function main() {
  try {
    console.log("=================================");
    console.log("🚀 FULL CIRCLE SETUP START");
    console.log("=================================");

    const apiKey = process.env.CIRCLE_API_KEY;

    if (!apiKey) {
      throw new Error("CIRCLE_API_KEY missing");
    }

    console.log("API KEY:", apiKey.slice(0, 12));
    console.log(
      "ENV:",
      apiKey.startsWith("TEST_") ? "SANDBOX" : "PRODUCTION"
    );

    /* =========================
       1. GENERATE SECRET
    ========================= */

    const entitySecret = crypto.randomBytes(32).toString("hex");

    console.log("=================================");
    console.log("🔐 NEW ENTITY SECRET GENERATED");
    console.log(entitySecret);
    console.log("=================================");

    /* =========================
       2. SAVE TO .env
    ========================= */

    const envPath = path.join(process.cwd(), ".env");
    let envContent = fs.readFileSync(envPath, "utf8");

    if (envContent.includes("ENTITY_SECRET=")) {
      envContent = envContent.replace(
        /ENTITY_SECRET=.*/g,
        `ENTITY_SECRET=${entitySecret}`
      );
    } else {
      envContent += `\nENTITY_SECRET=${entitySecret}`;
    }

    fs.writeFileSync(envPath, envContent);

    console.log("✅ .env updated");

    /* =========================
       3. FETCH PUBLIC KEY
    ========================= */

    console.log("=================================");
    console.log("🔐 Fetching public key...");
    console.log("=================================");

    const publicKey = await getPublicKey(apiKey);

    /* =========================
       4. ENCRYPT SECRET
    ========================= */

    console.log("=================================");
    console.log("🔒 Encrypting secret...");
    console.log("=================================");

    const ciphertext = await encryptEntitySecret(
      entitySecret,
      publicKey
    );

    console.log("Ciphertext length:", ciphertext.length);

    /* =========================
       5. CREATE WALLET SET
    ========================= */

    const idempotencyKey = crypto.randomUUID();

    console.log("=================================");
    console.log("🚀 Creating wallet set...");
    console.log("=================================");

    const res = await fetch(
      `${CIRCLE_BASE_URL}/v1/w3s/developer/walletSets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotencyKey,
          name: "ARC Treasury Root",
          entitySecretCiphertext: ciphertext,
        }),
      }
    );

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("=================================");
    console.log(JSON.stringify(data, null, 2));
    console.log("=================================");

    if (!res.ok) {
      console.error("❌ FAILED");

      console.log("\n🚨 MOST LIKELY CAUSE:");
      console.log(
        "You already registered a different entity secret for this project."
      );
      console.log(
        "👉 Create NEW Circle project OR recover original secret."
      );

      return;
    }

    console.log("🎯 SUCCESS — WALLET SET CREATED");
    console.log(data?.data?.walletSet?.id);

  } catch (err) {
    console.error("=================================");
    console.error("❌ ERROR");
    console.error(err.message || err);
    console.error("=================================");
  }
}

main();