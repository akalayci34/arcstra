import json

POINT_VALUE = 0.05

with open("CONTRIBUTIONS.json", "r") as f:
    contributions = json.load(f)

print("\n=== ARCSTRA WEEKLY REWARDS ===\n")

total_points = 0
total_rewards = 0

for agent, points in contributions.items():
    reward = points * POINT_VALUE

    total_points += points
    total_rewards += reward

    print(f"{agent}")
    print(f"  Points : {points}")
    print(f"  Reward : {reward:.2f} USDC\n")

print("================================")
print(f"Total Points : {total_points}")
print(f"Total Rewards: {total_rewards:.2f} USDC")
print("================================")