require("dotenv").config({ path: ".env" });

const axios = require("axios");

const key = process.env.CIRCLE_API_KEY;

// =====================
// DEBUG
// =====================
console.log("KEY EXISTS:", !!key);
console.log("KEY SPLIT:", key?.split(":")?.length);

if (!key) {
    throw new Error("CIRCLE_API_KEY missing");
}

// =====================
// AXIOS CLIENT
// =====================
const api = axios.create({
    baseURL: "https://api-sandbox.circle.com",
    headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
    }
});

// =====================
// TEST FUNCTION
// =====================
async function test() {
    try {
        // 🔥 SADECE HEALTH TEST (EN TEMİZ DEBUG)
        const result = await api.get("/v1/health");

        console.log("CONNECTED ✅");
        console.log(result.data);

    } catch (err) {
        console.log("ERROR STATUS:", err.response?.status);
        console.log("ERROR DATA:", err.response?.data || err.message);
    }
}

test();