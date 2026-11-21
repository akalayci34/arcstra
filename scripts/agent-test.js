const {createWallet}=require("../core/circle/circle");
const {createIdentity}=require("../core/identity/identity");
const {agentPay}=require("../orchestration/agents/agent-pay");

async function run(){

    const wallet=await createWallet();

    createIdentity(
        "archestration.arc",
        wallet.walletId
    );

    const payment=await agentPay(
        "archestration.arc",
        50
    );

    console.log(payment);

}

run();
