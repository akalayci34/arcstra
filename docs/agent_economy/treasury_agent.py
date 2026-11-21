import json
from datetime import datetime

POINT_VALUE = 0.05

with open("CONTRIBUTIONS.json", "r") as f:
    contributions = json.load(f)

report = []

report.append("# Weekly Agent Economy Report\n")
report.append(f"Generated: {datetime.now()}\n")

report.append("| Agent | Points | Reward |")
report.append("|--------|--------|--------|")

total_points = 0
total_rewards = 0

for agent, points in contributions.items():

    reward = points * POINT_VALUE

    total_points += points
    total_rewards += reward

    report.append(
        f"| {agent} | {points} | {reward:.2f} USDC |"
    )

report.append("")
report.append(f"Total Points: {total_points}")
report.append(f"Total Rewards: {total_rewards:.2f} USDC")

with open("WEEKLY_REPORT.md", "w", encoding="utf-8") as f:
    f.write("\n".join(report))

print("Weekly report generated.")