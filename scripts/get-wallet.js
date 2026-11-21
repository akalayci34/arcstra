require("dotenv").config();

async function main() {

  const walletId =
    process.env.CIRCLE_WALLET_ID;

  const res = await fetch(

    `https://api-sandbox.circle.com/v1/w3s/wallets/${walletId}`,

    {
      headers: {
        Authorization:
          `Bearer ${process.env.CIRCLE_API_KEY}`
      }
    }
  );

  console.log("STATUS:", res.status);

  const data = await res.json();

  console.log(
    JSON.stringify(data, null, 2)
  );
}

main().catch(console.error);