require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");

async function main() {

  try {

    const apiKey =
      process.env.CIRCLE_API_KEY;

    const entitySecretHex =
      process.env.CIRCLE_ENTITY_SECRET;

    if (!apiKey) {
      throw new Error(
        "CIRCLE_API_KEY missing"
      );
    }

    if (!entitySecretHex) {
      throw new Error(
        "CIRCLE_ENTITY_SECRET missing"
      );
    }

    console.log("=================================");
    console.log("🔍 ENTITY SECRET CHECK");
    console.log("=================================");

    console.log(
      "HEX LENGTH:",
      entitySecretHex.length
    );

    // HEX -> RAW BYTES
    const entitySecret =
      Buffer.from(
        entitySecretHex,
        "hex"
      );

    console.log(
      "RAW BYTES:",
      entitySecret.length
    );

    if (entitySecret.length !== 32) {
      throw new Error(
        "Entity secret must decode to 32 bytes"
      );
    }

    console.log("=================================");
    console.log("🔐 Fetching Circle public key...");
    console.log("=================================");

    const response =
      await fetch(
        "https://api.circle.com/v1/w3s/config/entity/publicKey",
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${apiKey}`,
          },
        }
      );

    const data =
      await response.json();

    if (
      !data?.data?.publicKey
    ) {
      throw new Error(
        "Failed to fetch public key"
      );
    }

    const publicKey =
      data.data.publicKey;

    console.log("=================================");
    console.log("🔒 Encrypting...");
    console.log("=================================");

    const encrypted =
      crypto.publicEncrypt(
        {
          key: publicKey,
          padding:
            crypto.constants
              .RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        entitySecret
      );

    const ciphertext =
      encrypted.toString("base64");

    fs.writeFileSync(
      "ciphertext.txt",
      ciphertext
    );

    console.log("=================================");
    console.log("✅ CIPHERTEXT GENERATED");
    console.log("=================================");

    console.log(
      "Saved to ciphertext.txt"
    );

  } catch (err) {

    console.log("=================================");
    console.log("❌ ERROR");
    console.log("=================================");

    console.log(
      err.message || err
    );
  }
}

main();