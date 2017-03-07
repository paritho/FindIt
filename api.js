'use strict';
let fs = require('fs');
let Sanitize = require('./sanitize.js');
let ProcessData = require('./process.js');
let FormFactory = require('./formFactory.js');
let db_path = './database/stackdata.json';



// /api/stack/:id/:action
function postRoute(data){
    
    data = JSON.parse(data);
    
    for(let prop in data) data[prop] = Sanitize.strip(data[prop]);
        
    let response = '';
    switch(data.act){
         case 'update':
            return UpdateExistingStack(data);
            break;
        case 'input':
            return AddNewStack(data);
            break;
        default:
            return {
                "status":300,
                "id":null,
                "msg":"No action taken"
            }
            break;
    }
}

function getRoute(url){
    // parse url: /api/stacks/1234
    url = Sanitize.strip(url.path);
    let id_rgx = /([0-9]+)/g;
    let id = url.match(id_rgx);
    
    if(!id) return {
        "status":400,
        "id":null,
        "msg":"Invalid stack ID provided"
    };

    // id is at position 0 in array
    let data = GetStackData(id.pop());
    
    let form, 
        options = {'action':'update'};

    // if obj.status, we didn't find a match
    // so we return a blank form. This form needs
    // the options of post and input
    if(data.status) options.action = 'input';

    // otherwise, go find the new form, add data to 
    // it and return the file.
    form = FormFactory.genUpdateForm(data,options);
    
    return {
        "status": data.status || 201,
        "id": data.id,
        "msg": form
    }
 
}


function AddNewStack(data){
    let ws_options = {flags:'a'};
    let ws = fs.createWriteStream(db_path,ws_options);
        
    if(data.stackID == '' || data.startCallNumber == '' || data.endCallNumber == ''){
        return {
            "status": 400,
            "id": null,
            "msg": 'Incomplete information provided'
        };
    }
    
    // need ',' prior to new obj
    let dataToWrite = ","+JSON.stringify(ProcessData.json(data))+"]}";
    
    // remove trailing ']}' from file
    let stats = fs.statSync(db_path);
    fs.truncateSync(db_path, stats.size - 2, (err)=> {if(err) throw err});

    console.log('writing to file');
    ws.write(dataToWrite, (err)=> {
        if(err) console.log('there was an error');
    });
    // replace trailing ']}'
    ws.end(console.log('file written'));
    
    return {
        "status":200,
        "id": data.stackID,
        "msg": "Success!"
    };

    // TODO: implement sorting and duplicates algorithm

}

function UpdateExistingStack(data){
    let dataToUpdate = ProcessData.json(data);
    let db = fs.readFileSync(db_path,'utf8');
        
    db = JSON.parse(db);
    
    let len = db.stacks.length;
    for(let i=0;i<len;++i){
        if(db.stacks[i].id == dataToUpdate.id){
            console.log('found stack: ', db.stacks[i].id);
            db.stacks[i] = dataToUpdate;
            break;
        }
    }

    let ws = fs.createWriteStream(db_path);
    ws.write(JSON.stringify(db),(err)=>{
        if(err) throw err;
    });
    ws.end(console.log('file updated'));
            
    return {
        "status":202,
        "id":dataToUpdate.id,
        "msg":`Data for stack ${dataToUpdate.id} updated`
    }

    // update that obj with new info from data.callnumbers
    // write file to disc

}

function GetStackData(id){
        
    let data = fs.readFileSync(db_path, 'utf8');
    // TODO: better error handling if json is malformed
    data = JSON.parse(data);
    let stacks = data.stacks;

    for(let stack of stacks){
        if(stack.id == id) return stack;
    }

    return {
        "status":404,
        "id":id,
        "msg": "No such stack found"
    };

}




module.exports.postRoute = postRoute;
module.exports.getRoute = getRoute;