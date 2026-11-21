import json
from datetime import datetime

with open("tasks.json","r") as f:
    task = json.load(f)

with open("agent_state.json","r") as f:
    state = json.load(f)

with open("ledger.json","r") as f:
    ledger = json.load(f)

if task["status"] == "completed" and task["paid"] == False:

    worker = task["worker"]
    reward = task["reward"]

    state["TreasuryAgent"]["balance"] -= reward
    state[worker]["balance"] += reward
    state[worker]["reputation"] += 5

    ledger.append({
        "timestamp": str(datetime.now()),
        "task_id": task["task_id"],
        "worker": worker,
        "reward": reward,
        "type": "task_settlement"
    })

    task["paid"] = True

    with open("agent_state.json","w") as f:
        json.dump(state,f,indent=2)

    with open("tasks.json","w") as f:
        json.dump(task,f,indent=2)

    with open("ledger.json","w") as f:
        json.dump(ledger,f,indent=2)

    print("Settlement completed.")

else:

    print("Task already settled.")