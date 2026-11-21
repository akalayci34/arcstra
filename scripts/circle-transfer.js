require("dotenv").config();

const crypto = require("crypto");

async function main() {

  const apiKey =
    process.env.CIRCLE_API_KEY;

  const walletId =
    process.env.CIRCLE_WALLET_ID;

  const entitySecretCiphertext =
    process.env.CIRCLE_ENTITY_SECRET_CIPHERTEXT;

  // RECEIVER
  const destinationAddress =
    "0xReceiverAddress";

  // TOKEN ID (USDC etc)
  const tokenId =
    process.env.CIRCLE_TOKEN_ID;

  const body = {

    idempotencyKey:
      crypto.randomUUID(),

    walletId,

    tokenId,

    destinationAddress,

    amounts: ["1"],

    entitySecretCiphertext,

    feeLevel: "MEDIUM"
  };

  console.log("================================");
  console.log("🚀 SENDING TRANSFER");
  console.log("================================");

  const res = await fetch(

    "https://api-sandbox.circle.com/v1/w3s/developer/transactions/transfer",

    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${apiKey}`,

        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(body)
    }
  );

  const data = await res.json();

  console.log("STATUS:", res.status);

  console.log(
    JSON.stringify(data, null, 2)
  );
}

main().catch(console.error);