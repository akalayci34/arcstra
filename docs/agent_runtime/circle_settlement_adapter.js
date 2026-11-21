const fs = require("fs");

const intents =
JSON.parse(
  fs.readFileSync(
    "payment_intents.json",
    "utf8"
  )
);

for (const intent of intents) {

  if (
    intent.status ===
    "ready_for_settlement"
  ) {

    console.log(
      "\n=== PAYMENT INTENT ==="
    );

    console.log(
      "FROM:",
      intent.from
    );

    console.log(
      "TO:",
      intent.to
    );

    console.log(
      "AMOUNT:",
      intent.amount,
      intent.asset
    );

    console.log(
      "\nNEXT STEP:"
    );

    console.log(
      "Circle createTransaction()"
    );
  }
}