const {getIdentity}=require("../../core/identity/identity");
const {logEvent}=require("../events/logger");
const {validate}=require("../policies/policy");

async function agentPay(agent,amount){

    validate(agent,amount);

    const identity=getIdentity(agent);

    if(!identity){

        throw new Error(
            "Identity not found"
        );

    }

    logEvent({

        type:"PAYMENT_REQUEST",
        agent,
        wallet:identity.walletId,
        amount

    });

    return {

        success:true,
        transferred:amount,
        wallet:identity.walletId

    };

}

module.exports={
    agentPay
};
