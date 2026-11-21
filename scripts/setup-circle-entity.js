require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
  generateEntitySecret,
  registerEntitySecretCiphertext,
} = require("@circle-fin/developer-controlled-wallets");

async function main() {
  try {
    console.log("=================================");
    console.log("🚀 CIRCLE ENTITY SETUP");
    console.log("=================================");

    const apiKey = process.env.CIRCLE_API_KEY;

    if (!apiKey) {
      throw new Error("CIRCLE_API_KEY missing in .env");
    }

    console.log("API KEY PREFIX:", apiKey.slice(0, 10));
    console.log(
      "ENVIRONMENT:",
      apiKey.startsWith("TEST_")
        ? "SANDBOX"
        : apiKey.startsWith("LIVE_")
        ? "PRODUCTION"
        : "UNKNOWN"
    );

    console.log("=================================");
    console.log("🔐 Generating NEW entity secret...");
    console.log("=================================");

    const entitySecret = generateEntitySecret();

    console.log("✅ ENTITY SECRET GENERATED");
    console.log(entitySecret);

    console.log("=================================");
    console.log("💾 Saving ENTITY_SECRET into .env");
    console.log("=================================");

    const envPath = path.join(process.cwd(), ".env");

    let envContent = fs.readFileSync(envPath, "utf8");

    envContent = envContent.replace(
      /ENTITY_SECRET=.*/g,
      `ENTITY_SECRET=${entitySecret}`
    );

    fs.writeFileSync(envPath, envContent);

    console.log("✅ .env updated");

    console.log("=================================");
    console.log("📝 Registering entity secret...");
    console.log("=================================");

    const response = await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
      recoveryFileDownloadPath: "./recovery",
    });

    console.log("=================================");
    console.log("✅ ENTITY SECRET REGISTERED");
    console.log("=================================");

    console.log(response);

    console.log("=================================");
    console.log("⚠️ IMPORTANT");
    console.log("=================================");
    console.log("1. BACKUP your recovery folder");
    console.log("2. NEVER lose ENTITY_SECRET");
    console.log("3. NEVER regenerate unless resetting");
    console.log("=================================");

  } catch (err) {
    console.error("=================================");
    console.error("❌ ERROR");
    console.error(err.message || err);
    console.error("=================================");
  }
}

main();