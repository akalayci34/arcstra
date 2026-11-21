require("dotenv").config();

async function main() {
  const apiKey = process.env.CIRCLE_API_KEY;

  if (!apiKey) {
    throw new Error("CIRCLE_API_KEY missing");
  }

  const response = await fetch("https://api.circle.com/ping", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  console.log("=================================");
  console.log("✅ CIRCLE API CONNECTED");
  console.log(data);
  console.log("=================================");
}

main().catch((err) => {
  console.error("❌ ERROR:");
  console.error(err.message || err);
});