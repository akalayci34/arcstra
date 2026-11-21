require("dotenv").config();

console.log("=== ENV CHECK ===");

const keys = Object.keys(process.env)
  .filter(k =>
    k.includes("ARC") ||
    k.includes("CHAIN") ||
    k.includes("RPC") ||
    k.includes("WALLET")
  )
  .sort();

for (const key of keys) {
  console.log(`${key}=${process.env[key]}`);
}