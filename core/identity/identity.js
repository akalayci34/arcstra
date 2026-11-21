const fs=require("fs");

const FILE="./data/identities.json";

function load(){

    return JSON.parse(
        fs.readFileSync(FILE,"utf8")
    );

}

function save(data){

    fs.writeFileSync(
        FILE,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}

function createIdentity(name,walletId){

    const identities=load();

    identities[name]={

        walletId,
        createdAt:new Date()

    };

    save(identities);

    return identities[name];

}

function getIdentity(name){

    const identities=load();

    return identities[name];

}

module.exports={

    createIdentity,
    getIdentity

};
