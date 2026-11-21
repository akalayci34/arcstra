require("dotenv").config({ path: ".env" });

const crypto = require("crypto");
const fs = require("fs");

const {
  registerEntitySecretCiphertext,
} = require("@circle-fin/developer-controlled-wallets");

async function registerEntity() {
  try {
    const apiKey = process.env.CIRCLE_API_KEY;

    if (!apiKey) {
      throw new Error(
        "CIRCLE_API_KEY missing in .env"
      );
    }

    // Daha önce kayıtlı mı kontrol
    const envContent =
      fs.existsSync(".env")
        ? fs.readFileSync(".env", "utf8")
        : "";

    if (
      /^CIRCLE_ENTITY_SECRET=/m.test(
        envContent
      )
    ) {
      throw new Error(
        "CIRCLE_ENTITY_SECRET already exists in .env"
      );
    }

    console.log("=================================");
    console.log("🔐 GENERATING ENTITY SECRET");
    console.log("=================================");

    // HEX formatında 32-byte secret
    const entitySecret =
      crypto
        .randomBytes(32)
        .toString("hex");

    console.log(
      "Entity Secret Length:",
      entitySecret.length
    );

    // Recovery klasörü
    fs.mkdirSync(
      "./recovery",
      { recursive: true }
    );

    console.log("=================================");
    console.log("🚀 REGISTERING WITH CIRCLE");
    console.log("=================================");

    await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
      recoveryFileDownloadPath:
        "./recovery",
    });

    // .env içine kaydet
    fs.appendFileSync(
      ".env",
      `\nCIRCLE_ENTITY_SECRET=${entitySecret}\n`
    );

    console.log("=================================");
    console.log("✅ ENTITY REGISTERED");
    console.log("=================================");

    console.log(
      "Recovery folder:"
    );

    console.log("./recovery");

  } catch (err) {

    console.log("=================================");
    console.log("❌ ERROR");
    console.log("=================================");

    console.log(
      err.response?.data ||
      err.message ||
      err
    );
  }
}

registerEntity();