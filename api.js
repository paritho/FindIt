'use strict';
let fs = require('fs');
let DataProcessor = require('./process.js');
let FormFactory = require('./formFactory.js');
let db_path = './database/stackdata.json';

let db = require('./database/db.js');

// /api/stack/:id/:action
function postRoute(data){
    
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

function getRoute(url){
    let id_rgx = /([0-9]+)$/igm;
    url = DataProcessor.strip(url);
    let id = url.match(id_rgx);
    
    if(!id) return {
        "status":400,
        "id":null,
        "msg":"Invalid stack ID provided"
    };

    let data = db.lookup(id[0]);

    // if we didn't find a match, we need a blank form next
    if(data) return {
        "status":201,
        "id":data.id,
        "content": FormFactory.generateForm({"type":"update"},data),
        "msg":`Stack ${data.id} found`
    };   

    return {
        "status": 201,
        "id": id,
        "content": FormFactory.generateForm({"type":"input"},{"id":id}),
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
        "content": FormFactory.generateForm({"type":"lookup"}),
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
        "content": FormFactory.generateForm({"type":"lookup"}, data),
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
        "content": FormFactory.generateForm({"type":"lookup"}, data),
        "msg": `Successfully updated stack with id: ${data.id}`
        };
    
    return {
        "status":500,
        "id": data.id,
        "msg": "Couldn't update db"
    };
}





module.exports.postRoute = postRoute;
module.exports.getRoute = getRoute;
module.exports.deleteRoute = deleteRoute;

