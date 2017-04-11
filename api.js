'use strict';
let fs = require('fs');
let DataProcessor = require('./process.js');
let db = require('./database/db.js');

// /api/stack/:id/:action
function post(data){
    data = JSON.parse(data);
    let action = DataProcessor.strip(data.act);
    
    // ProcessData also sanitizes it
    data = DataProcessor.json(data);
        
    let response = '';
    switch(action){
         case 'update':
            return updateStack(data);
            break;
        case 'input':
            return insertStack(data);
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

function get(url){
    url = DataProcessor.strip(url);
    // /api/search/:terms => search all stacks by term
    if(url.indexOf('search')>-1){
        // parse rest of url to get terms
        // return search(db, term)
    }

    // /api/stacks/all => return all db info
    // /api/stack/:id => return 1 stack info

    if(url.indexOf('stack') > -1) return getStackById(url);

 
}

function getStackById(path){
    let id_rgx = /([0-9]+)$/igm;
    let id = path.match(id_rgx);
    
    if(!id) return {
        "status":400,
        "id":null,
        "msg":"Invalid stack ID provided"
    };

    let data = db.lookup(id[0]);

    if(data) return {
        "status":201,
        "id":data.id,
        "content": {"type":"update","data":data},
        "msg":`Stack ${data.id} found`
    };   

    return {
        "status": 404,
        "id": id,
        "content": {"type":"input","data":{"id":id}},
        "msg": `Stack ${id} not found.`
    }
}

function deleteRoute(url){
    let id_rgx = /([0-9]+)$/igm;
    url = DataProcessor.strip(url);
    let id = url.match(id_rgx);
        
    if(!id) return {
        "status":400,
        "id":null,
        "msg":"Invalid stack ID provided"
    };

    if(db.remove(id)) return {
        "status": 201,
        "id": id,
        "content": {"type":"lookup","data":null},
        "msg":`Stack: ${id} removed from db`
    };

    return {
        "status":500,
        "id": data.stackID,
        "msg": "Couldn't remove from the DataBase. Please Try again later"
    };
}


function insertStack(data){
    
    if(db.insert(data)) return {
        "status":201,
        "id": data.id,
        "content": {"type":"lookup","data":data},
        "msg": `Success! Stack #${data.id} inserted.`
    };
    
    return {
        "status":500,
        "id": data.stackID,
        "msg": "Couldn't insert into the DataBase. Please Try again later"
    };
}

function updateStack(data){
    
    if(db.update(data)) return {
        "status":201,
        "id": data.id,
        "content":{"type":"lookup","data":data},
        "msg": `Successfully updated stack with id: ${data.id}`
        };
    
    return {
        "status":500,
        "id": data.id,
        "msg": "Couldn't update db"
    };
}





module.exports.post = post;
module.exports.get = get;
module.exports.delete = deleteRoute;

