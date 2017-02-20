'use strict';
let fs = require('fs');

let rs_options = {};

let rs = fs.createReadStream('./database/stackdata.json',rs_options);


// /api/stack/:id/:action
function go(data){
    data = JSON.parse(data);
    console.log(data);
    
    let action = data.act;
    let response = '';
    switch(action){
        case 'input':
            response = AddNewStack(data);
            break;
        case 'update':
            response = UpdateExistingStack(data);
            break;
        case '':
            break;
        default:
            response = 'No action taken';
            break;
    }
    return response;
}

function AddNewStack(data){
    let ws_options = {flags:'a'};
    let ws = fs.createWriteStream('./database/stackdata.json',ws_options);
    
    let obj_to_write = {
        "stackID":data.stackID,
        "stCallNumber":data.stCallNumber,
        "endCallNumber":data.endCallNumber
        
    };

    const buff = Buffer.from(JSON.stringify(obj_to_write));
    console.log('writing to file');
    ws.write(buff);
    console.log('file written');
    
    let result = {
        "path": './assets/success.html',
    };
    
    return result;
}

function UpdateExistingStack(data){
    
    return '';
}




module.exports.go = go;