import json

POINT_VALUE = 0.05

# Load contributions
with open("CONTRIBUTIONS.json", "r") as f:
    contributions = json.load(f)

# Load wallets
with open("wallets.json", "r") as f:
    wallets = json.load(f)

total_points = 0
total_rewards = 0

report = "# ARCSTRA Payment Report\n\n"
report += "| Agent | Wallet | Points | Reward |\n"
report += "|---------|---------|---------|---------|\n"

for agent, points in contributions.items():

    reward = points * POINT_VALUE

    wallet = wallets.get(agent, {}).get(
        "wallet_address",
        "UNKNOWN"
    )

    report += (
        f"| {agent} | "
        f"{wallet} | "
        f"{points} | "
        f"{reward:.2f} USDC |\n"
    )

    total_points += points
    total_rewards += reward

report += "\n"
report += f"**Total Points:** {total_points}\n\n"
report += f"**Total Rewards:** {total_rewards:.2f} USDC\n"

with open("PAYMENT_REPORT.md", "w") as f:
    f.write(report)

print("Payment report generated.")