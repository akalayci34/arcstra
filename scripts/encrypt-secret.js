const crypto = require("crypto");
require("dotenv").config();

async function main() {
  const entitySecret = process.env.ENTITY_SECRET;

  if (!entitySecret || entitySecret.length !== 64) {
    throw new Error("ENTITY_SECRET must be 64 hex characters");
  }

  console.log("=================================");
  console.log("🔍 ENV CHECK");
  console.log("=================================");
  console.log("ENTITY_SECRET length:", entitySecret.length);

  console.log("=================================");
  console.log("🔐 Fetching Circle public key...");
  console.log("=================================");

  const res = await fetch(
    "https://api-sandbox.circle.com/v1/w3s/config/entity/publicKey",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  console.log("=================================");
  console.log("📦 FULL RESPONSE");
  console.log("=================================");
  console.log(data);

  if (!data?.data?.entityPublicKey) {
    throw new Error("Failed to fetch entity public key");
  }

  const publicKey = data.data.entityPublicKey;

  console.log("=================================");
  console.log("🔒 Encrypting entity secret...");
  console.log("=================================");

  const buffer = Buffer.from(entitySecret, "utf8");

  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );

  const ciphertext = encrypted.toString("base64");

  console.log("=================================");
  console.log("✅ CIPHERTEXT GENERATED");
  console.log("=================================");
  console.log("Length:", ciphertext.length);
  console.log(ciphertext);
}

main().catch((err) => {
  console.error("=================================");
  console.error("❌ ERROR");
  console.error(err.message);
  console.error("=================================");
});