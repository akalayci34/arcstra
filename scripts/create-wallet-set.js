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
    console.log("🔍 ENV CHECK");
    console.log("=================================");

    console.log(
      "ENTITY_SECRET length:",
      entitySecretHex.length
    );

    console.log(
      "ENTITY_SECRET preview:",
      entitySecretHex.slice(0, 12) + "..."
    );

    console.log(
      "API KEY PREFIX:",
      apiKey.slice(0, 14)
    );

    // HEX -> RAW 32 BYTES
    const entitySecret =
      Buffer.from(
        entitySecretHex,
        "hex"
      );

    console.log(
      "RAW SECRET BYTES:",
      entitySecret.length
    );

    if (
      entitySecret.length !== 32
    ) {
      throw new Error(
        "Entity secret must decode to exactly 32 bytes"
      );
    }

    console.log("=================================");
    console.log("🔐 Fetching Circle public key...");
    console.log("=================================");

    const pubKeyResponse =
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

    console.log(
      "Public Key Status:",
      pubKeyResponse.status
    );

    const pubKeyData =
      await pubKeyResponse.json();

    if (
      !pubKeyData?.data?.publicKey
    ) {
      console.log(pubKeyData);

      throw new Error(
        "Failed to fetch Circle public key"
      );
    }

    const publicKey =
      pubKeyData.data.publicKey;

    console.log("=================================");
    console.log("🔒 Encrypting entity secret...");
    console.log("=================================");

    const encryptedData =
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

    const entitySecretCiphertext =
      encryptedData.toString("base64");

    fs.writeFileSync(
  "ciphertext.txt",
  entitySecretCiphertext
);

console.log(
  "Ciphertext saved to ciphertext.txt"
);

    console.log("=================================");
    console.log("📋 CIPHERTEXT");
    console.log("=================================");

    console.log(
      entitySecretCiphertext
    );

    console.log("=================================");
    console.log("⚠️ IMPORTANT");
    console.log("=================================");

    console.log(
      "Copy the ciphertext above"
    );

    console.log(
      "Paste it into:"
    );

    console.log(
      "Circle Console → Configurator → Entity Secret"
    );

    console.log(
      "Field:"
    );

    console.log(
      "New entity secret ciphertext"
    );

    const idempotencyKey =
      crypto.randomUUID();

    console.log("=================================");
    console.log("🚀 Creating Wallet Set...");
    console.log("=================================");

    console.log(
      "Idempotency Key:",
      idempotencyKey
    );

    const response =
      await fetch(
        "https://api.circle.com/v1/w3s/developer/walletSets",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${apiKey}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            idempotencyKey,
            name:
              "ARC Treasury Root",
            entitySecretCiphertext,
          }),
        }
      );

    console.log(
      "STATUS:",
      response.status
    );

    const data =
      await response.json();

    console.log("=================================");
    console.log("📦 RESPONSE");
    console.log("=================================");

    console.log(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    console.log("=================================");

    if (
      data?.data?.walletSet?.id
    ) {

      const walletSetId =
        data.data.walletSet.id;

      console.log("=================================");
      console.log("✅ WALLET SET CREATED");
      console.log("=================================");

      console.log(
        walletSetId
      );

      // .env içine otomatik yaz
      const envAppend =
        `\nCIRCLE_WALLET_SET_ID=${walletSetId}\n`;

      fs.appendFileSync(
        ".env",
        envAppend
      );

      console.log("=================================");
      console.log("💾 SAVED TO .env");
      console.log("=================================");
    }

  } catch (err) {

    console.log("=================================");
    console.log("❌ ERROR");
    console.log("=================================");

    console.log(
      err?.response?.data ||
      err.message ||
      err
    );
  }
}

main();