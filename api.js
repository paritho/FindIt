'use strict';
let fs = require('fs');
let Sanitize = require('./sanitize.js');
let ProcessData = require('./process.js');

let db_path = './database/stackdata.json';



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
        default:
            response = 'No action taken';
            break;
    }
    return response;
}

function getRoute(url){
    // parse url: /api/stacks/1234
    url = Sanitize.strip(url.path);
    let id_rgx = /([0-9]+)/g;
    let id = url.match(id_rgx);
    
    if(!id) return {
        "status":418,
        "id":null,
        "msg":"Invalid stack ID provided"
    };

    GetStackData(id);
    return {
        'status':404,
        'id':id,
        'msg':'nothing to report'
    };
}


function AddNewStack(data){
    let ws_options = {flags:'a'};
    let ws = fs.createWriteStream(db_path,ws_options);
        
    if(data.stackID == '' || data.stCallNumber == '' || data.endCallNumber == ''){
        return {
            "status": 400,
            "id": null,
            "msg": 'Incomplete information provided'
        };
    }
    
    // need ',' prior to new obj
    let dataToWrite = "," + ProcessData.json(data);
    
    // remove trailing ']}' from file
    fs.stat(db_path, (err,stats)=>{
        if(err) throw err;
        fs.truncateSync(db_path, stats.size - 2, (err)=> {if(err) throw err});
    });

    //const buff = Buffer.from(dataToWrite);
    console.log('writing to file');
    ws.write(dataToWrite, (err)=> {
        if(err) console.log('there was an error');
    });
    // replace trailing ']}'
    ws.end(']}',console.log('file written'));
    
    let result = {
        "status":200,
        "id": data.stackID,
        "msg": "Success!"
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