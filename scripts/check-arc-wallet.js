require("dotenv").config();

const {
  createWalletClient,
  createPublicClient,
  http,
} = require("viem");

const { privateKeyToAccount } = require("viem/accounts");
const { baseSepolia } = require("viem/chains");

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL;

  // ENV CHECKS
  if (!privateKey) {
    throw new Error(
      "❌ PRIVATE_KEY bulunamadı. .env dosyasını kontrol et."
    );
  }

  if (!rpcUrl) {
    throw new Error(
      "❌ RPC_URL bulunamadı. .env dosyasını kontrol et."
    );
  }

  // 0x kontrolü
  const formattedPrivateKey = privateKey.startsWith("0x")
    ? privateKey
    : `0x${privateKey}`;

  const account = privateKeyToAccount(formattedPrivateKey);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const balance = await publicClient.getBalance({
    address: account.address,
  });

  console.log("=================================");
  console.log("✅ WALLET CONNECTED");
  console.log("ADDRESS:", account.address);
  console.log("BALANCE:", balance.toString());
  console.log("=================================");
}

main().catch((err) => {
  console.error("❌ ERROR:");
  console.error(err.message || err);
});