require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");

const {
  registerEntitySecretCiphertext
} = require(
  "@circle-fin/developer-controlled-wallets"
);

async function main() {

  try {

    const apiKey =
      process.env.CIRCLE_API_KEY;

    if (!apiKey) {
      throw new Error(
        "CIRCLE_API_KEY missing"
      );
    }

    // Yeni entity secret üret
    const entitySecret =
      crypto
        .randomBytes(32)
        .toString("hex");

    console.log("=================================");
    console.log("🆕 NEW ENTITY SECRET");
    console.log("=================================");

    console.log(entitySecret);

    console.log("=================================");
    console.log("🚀 Registering with Circle...");
    console.log("=================================");

    await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
      recoveryFileDownloadPath:
        "./recovery"
    });

    // .env içine otomatik yaz
    fs.appendFileSync(
      ".env",
      `\nCIRCLE_ENTITY_SECRET=${entitySecret}\n`
    );

    console.log("=================================");
    console.log("✅ ENTITY REGISTERED");
    console.log("=================================");

    console.log(
      "Saved into .env"
    );

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