require("dotenv").config();

const API_KEY = process.env.CIRCLE_API_KEY;

function headers() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };
}

async function circleFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers(),
      ...(options.headers || {})
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data;
}

module.exports = {
  circleFetch
};