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
    
    if(!data) return {
        "status":400,
        "id":null,
        "content": {"type":"lookup","data":"None"},
        "msg":`Invalid call number`
    };
        
    let defaults = {
        "status":300,
        "id":null,
        "msg":"No action taken"
    };
    
    let actions = {
        'update':updateStack,
        'input':insertStack
    };

    if(typeof actions[action] !== 'function') return defaults;

    return actions[action](data);

}

function get(url){
    url = DataProcessor.strip(url);

    // /api/search/:terms => search all stacks by term
    if(url.indexOf('search')>-1){
        // parse rest of url 
        // extract everything after the word 'call' in the url
        // this is where the callnumber lives
        let cn = url.slice(url.indexOf('call')+4);

        // send to processor to get callnumber obj
        let callNumber = DataProcessor.json({'startCallNumber':cn});

        if(!callNumber) return {
            "status":404,
            "id":null,
            "content": {"type":"lookup","data":"None"},
            "msg":`Invalid call number`
        };

        let stackNum = db.search(callNumber);

        if(stackNum > 0){
            return  {
                "status":200,
                "id":stackNum,
                "content": {"type":"result","data":stackNum},
                "msg":`Call number ${cn} found on stack ${stackNum}`
            };
        }
        
        return  {
            "status":404,
            "id":null,
            "content": {"type":"result","data":"None"},
            "msg":`No Stack Found`
        };

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

