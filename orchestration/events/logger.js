function logEvent(event){

    console.log("[EVENT]",{
        id:"evt_"+Date.now(),
        timestamp:new Date(),
        ...event
    });

}

module.exports={
    logEvent
};
