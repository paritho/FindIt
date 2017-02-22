'use strict';
let fs = require('fs');
let Sanitize = require('./sanitize.js');
let ProcessData = require('./process.js');

let rs_options = {};

let rs = fs.createReadStream('./database/stackdata.json',rs_options);


// /api/stack/:id/:action
function postRoute(data){
    
    data = JSON.parse(data);
    
    for(let prop in data){
        data[prop] = Sanitize.strip(data[prop]);
    }
        
    let action = data.act;
    let response = '';
    switch(action){
        case 'input':
            response = AddNewStack(data);
            break;
        case 'update':
            response = UpdateExistingStack(data);
            break;
        default:
            response = 'No action taken';
            break;
    }
    return response;
}

function getRoute(request){
    
}


function AddNewStack(data){
    let ws_options = {flags:'a'};
    let ws = fs.createWriteStream('./database/stackdata.json',ws_options);
    
    if(data.stackID == '' || data.stCallNumber == '' || data.endCallNumber == ''){
        return {
            "status": 418,
            "id":'Incomplete information'
        };
    }
    
    let obj_to_write = ProcessData.json(data);
    
    const buff = Buffer.from(JSON.stringify(obj_to_write));
    console.log('writing to file');
    ws.write(buff);
    console.log('file written');
  
    let result = {
        "status":200,
        "id": data.stackID
    };
    
    return result;
}

function UpdateExistingStack(data){
    
    return '';
}

function GetStackData(id){
    
}




module.exports.postRoute = postRoute;
module.exports.getRoute = getRoute;