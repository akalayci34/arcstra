require("dotenv").config();

async function getPublicKey() {
  try {
    const apiKey = process.env.CIRCLE_API_KEY;

    if (!apiKey) {
      throw new Error("CIRCLE_API_KEY environment variable missing");
    }

    console.log("API KEY FOUND");

    const response = await fetch(
      "https://api.circle.com/v1/w3s/config/entity/publicKey",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}

getPublicKey();