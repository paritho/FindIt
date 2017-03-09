'use strict';
let fs = require('fs');
let Sanitize = require('./sanitize');
let ProcessData = require('./process.js');
let FormFactory = require('./formFactory.js');
let db_path = './database/stackdata.json';

let db = require('./database/db.js');

// /api/stack/:id/:action
function postRoute(data){
    
    data = JSON.parse(data);
    let action = Sanitize.strip(data.act);
    
    data = ProcessData.json(data);
        
    let response = '';
    switch(action){
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
    let id_rgx = /([0-9]+)/g;
    url = Sanitize.strip(url.path);
    let id = url.match(id_rgx)[0];
    
    if(!id) return {
        "status":400,
        "id":null,
        "msg":"Invalid stack ID provided"
    };

    let data = db.lookup(id),
        form, 
        options = {'action':'update'};

    // if we didn't find a match, we need a blank form next
    if(!data) {
        options.action = 'input';
        data = {
            "status":404,
            "id":id,
            "msg": "No such stack found"
        }
    }

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
    if(db.insert(data))
        return {
            "status":200,
            "id": data.id,
            "msg": "Success!"
        };
    
    return {
        "status":500,
        "id": data.stackID,
        "msg": "Couldn't insert into the DataBase. Please Try again later"
    };
}

function UpdateExistingStack(data){
    

}




module.exports.postRoute = postRoute;
module.exports.getRoute = getRoute;

