const policies={

    "archestration.arc":{

        maxTransfer:1000,
        canTransfer:true

    }

};

function validate(agent,amount){

    const policy=policies[agent];

    if(!policy){

        throw new Error(
            "Policy not found"
        );

    }

    if(!policy.canTransfer){

        throw new Error(
            "Transfer denied"
        );

    }

    if(amount>policy.maxTransfer){

        throw new Error(
            "Transfer limit exceeded"
        );

    }

    return true;

}

module.exports={
    validate
};
