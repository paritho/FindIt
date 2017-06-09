'use strict';

function json(data){
    for(let prop in data) data[prop] = strip(data[prop]);

    let stcn = parseCallNumber(data.startCallNumber.replace(' ', ''));

    if(!stcn) return null;

    let floor = getFloor(stcn.letters[0]);
    let edcn = undefined;

    if(data.endCallNumber) edcn = parseCallNumber(data.endCallNumber.replace(' ', ''));
        
    return {
        "id":parseInt(data.stackID) || null,
        "callNumbers":{
            "start": stcn,
            "end": edcn
        },
        "floor": floor
    };
}

function parseCallNumber(callnum){
    if(!callnum) return;

    // match PR6005 .h5 
    let rgx = /(\w{2})(\d+)(\.\w{1}\d+)/gi,
        parsed = rgx.exec(callnum),
        // if secondary book info is provided in the call num:
        // match d47 1956
        secRgx = /\s(\w{1}\d+)\s(\d{4})/gi,
        secInfo = secRgx.exec(callnum) || undefined;
        
    if(!parsed) return null;

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

function strip(data){
    // clear malictous char from data
    return data.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi,'');
}

module.exports.strip = strip;
module.exports.json = json;