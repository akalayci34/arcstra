import json

with open("payment_intents.json","r") as f:
    intents = json.load(f)

for intent in intents:

    if intent["status"] == "pending":

        intent["status"] = "ready_for_settlement"

        print(
            f"Intent {intent['intent_id']} ready."
        )

with open("payment_intents.json","w") as f:
    json.dump(intents,f,indent=2)