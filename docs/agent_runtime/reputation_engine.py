import json

with open("agents.json", "r") as f:
    agents = json.load(f)

print("=== ARCSTRA REPUTATION REPORT ===\n")

for agent_name, data in agents.items():

    contribution_points = 10
    successful_tasks = 5

    reputation = (
        successful_tasks * 5
        + contribution_points * 2
    )

    print(f"{agent_name}")
    print(f"Reputation: {reputation}")
    print()