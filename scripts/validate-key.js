require("dotenv").config({ path: ".env" });

const axios = require("axios");

async function validate() {
    try {

        const key = process.env.CIRCLE_API_KEY;

        const result = await axios.get(
            "https://api-sandbox.circle.com/v1/w3s/config/entity/publicKey",
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("KEY VALID ✅");
        console.log(
            JSON.stringify(
                result.data,
                null,
                2
            )
        );

    } catch (err) {

        console.log(
            "STATUS:",
            err.response?.status
        );

        console.log(
            "DATA:",
            err.response?.data ||
            err.message
        );

    }
}

validate();