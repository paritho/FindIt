'use strict';

function json(data){
    let stcn = parseCallNumber(data.startCallNumber),
        edcn = parseCallNumber(data.endCallNumber),
        floor = getFloor(stcn.letters[0]);
        
    return JSON.stringify({
        "id":parseInt(data.stackID),
        "callNumbers":{
            "start": stcn,
            "end": edcn
        },
        "floor": floor
    });
}

function parseCallNumber(callnum){
    // match PR6005 .h5 
    let rgx = /(\w{2})(\d+)\s(\.\w{1}\d+)/gi,
        parsed = rgx.exec(callnum),
        // if secondary book info is provided in the call num:
        // match d47 1956
        secRgx = /\s(\w{1}\d+)\s(\d{4})/gi,
        secInfo = secRgx.exec(callnum) || undefined;
        
    return {
        "full": parsed[0],
        "letters":parsed[1].split(''),
        "rank": parseInt(parsed[2]),
        "decimal": parsed[3],
        "position": secInfo ? secInfo[1] : undefined,
        "year": secInfo ? secInfo[2] : undefined
    };
}

function getFloor(char){
    // A-H = 2nd floor, J-Z = 3rd floor
    return char.match(/[a-h]/i) ? "2nd Floor" : "3rd Floor";
}




module.exports.json = json;