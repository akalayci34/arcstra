require("dotenv").config();

const { ethers } = require("ethers");

async function main() {

  const provider =
    new ethers.JsonRpcProvider(
      process.env.RPC_URL
    );

  const wallet =
    new ethers.Wallet(
      process.env.PRIVATE_KEY,
      provider
    );

  console.log("SENDER:", wallet.address);

  const tx =
    await wallet.sendTransaction({

      to:
        "0xReceiverAddress",

      value:
        ethers.parseEther("0.001")
    });

  console.log("TX HASH:", tx.hash);

  await tx.wait();

  console.log("CONFIRMED ✅");
}

main().catch(console.error);