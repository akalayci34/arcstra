const crypto = require("crypto");

const secret =
  crypto.randomBytes(32).toString("hex");

console.log(secret);
console.log("Length:", secret.length);