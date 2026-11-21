require("dotenv").config();

const {
  initiateDeveloperControlledWalletsClient
} = require(
  "@circle-fin/developer-controlled-wallets"
);

const DESTINATION =
  "0xaf822c0502D7308efeb8ca7993b9017d248E00Ec";

const USDC_TOKEN_ID =
  "bdf128b4-827b-5267-8f9e-243694989b5f";

async function main() {

  console.log(
    "\n=== ARCSTRA CIRCLE ENGINE ===\n"
  );

  const client =
    initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY,
      entitySecret:
        process.env.CIRCLE_ENTITY_SECRET
    });

  const wallet =
    await client.getWallet({
      id: process.env.CIRCLE_WALLET_ID
    });

  console.log(
    "Wallet ID:",
    wallet.data.wallet.id
  );

  console.log(
    "Address:",
    wallet.data.wallet.address
  );

  console.log(
    "Blockchain:",
    wallet.data.wallet.blockchain
  );

  console.log(
    "\n=== INITIAL BALANCES ===\n"
  );

  const balances =
    await client.getWalletTokenBalance({
      id: process.env.CIRCLE_WALLET_ID,
      includeAll: true
    });

  console.dir(
    balances.data,
    { depth: null }
  );

  console.log(
    "\n=== TEST USDC TRANSFER ===\n"
  );

  console.log(
    "TO:",
    DESTINATION
  );

  try {

    const response =
      await client.createTransaction({

        walletId:
          process.env.CIRCLE_WALLET_ID,

        tokenId:
          USDC_TOKEN_ID,

        amount: [
          "1"
        ],

        destinationAddress:
          DESTINATION,

        fee: {
          type: "level",
          config: {
            feeLevel: "MEDIUM"
          }
        }
      });

    console.log(
      "\n=== TRANSACTION RESPONSE ===\n"
    );

    console.dir(
      response.data,
      { depth: null }
    );

    const transactionId =
      response.data.id;

    console.log(
      "\nTRANSACTION ID:",
      transactionId
    );

    console.log(
      "\n=== WAITING 15 SECONDS ===\n"
    );

    await new Promise(
      resolve => setTimeout(resolve, 15000)
    );

    const tx =
      await client.getTransaction({
        id: transactionId
      });

    console.log(
      "\n=== TRANSACTION STATUS ===\n"
    );

    console.dir(
      tx.data,
      { depth: null }
    );

    console.log(
      "\n=== IMPORTANT FIELDS ===\n"
    );

    console.log(
      "STATE:",
      tx.data.state
    );

    console.log(
      "TX HASH:",
      tx.data.txHash
    );

    console.log(
      "ERROR:",
      tx.data.errorReason
    );

    console.log(
      "\n=== FINAL BALANCES ===\n"
    );

    const finalBalances =
      await client.getWalletTokenBalance({
        id: process.env.CIRCLE_WALLET_ID,
        includeAll: true
      });

    console.dir(
      finalBalances.data,
      { depth: null }
    );

  } catch (err) {

    console.log(
      "\n=== TRANSACTION ERROR ===\n"
    );

    console.dir(
      err?.response?.data || err,
      { depth: null }
    );
  }

}

main().catch(console.error);