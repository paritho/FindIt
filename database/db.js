'use strict';

let fs = require('fs'),
    dbPath = './database/stackdata2.json',
    dirty = false,
    db;

// load data into memory
// changes database to be indexed by stack id for
// fast lookup
let loadDB = function(path){
    // we don't want to write to disc while loading
    dirty = false; 
    db = {};

    let data = fs.readFileSync(path, 'utf8',function(e){
        if(e) {
            console.log('couldnt read database');
            throw e;
        }
    });

    data = data.trim();
    if(!data) {
        console.log('db is empty');
        return;
    }
    
    data = JSON.parse(data);
    
    let stacks = data.stacks;
    let len = stacks.length;
    
    for(let i=0;i<len;++i){
        let id = stacks[i].id;
        let obj = {};

        for(let prop in stacks[i]){
            obj[prop] = stacks[i][prop];
        }

        db[id] = obj;
    }
}
loadDB(dbPath);
 
// check every second if data was added or removed
// from the in-memory file. If so, write the data to disc
(function monitorDB(){
    let check = setInterval(function(){
        if(!dirty) return;
        console.log('db changed, writing to disc');
        writeToDisc(db);
    },1000);
})();

function writeToDisc(database){
    let ws = fs.createWriteStream(dbPath);

    let stacks = [];
    for(let item in database) stacks.push(database[item]);
    
    let str = '{"stacks":' + JSON.stringify(stacks) + "}";
    console.log(str);

    ws.write(str,function(err){
        if(err) throw err;
    });

    ws.end(function(){
        // reload data into memory
        loadDB(dbPath);
        console.log('data written to disc');
    });
}


function lookup(id){
    return db[id];
}

function insert(data){
    let id = data.id;
    if(lookup(id)) return false;

    let obj = {};
    for(let prop in data){
        obj[prop] = data[prop];
    }

    db[id] = obj;

    // tell monitorDB we changed something
    dirty = true; 

    // tells us if insert succeeded
    if(lookup(id)) return true;
}

function update(data){
    if(!db[data.id]) return {
        "status":404,
        "id":id,
        "msg":`Stack data for id: ${id} not found`
    };

    db[data.id] = data;
    dirty = true;

    if(db[data.id].callNumbers.start.full == data.callNumbers.start.full) return true;
}

function remove(id){
    delete db[id];

    // tell monitorDB something was changed
    dirty = true;

    // tells us if remove was successful
    if(!lookup(id)) return true;
}

module.exports.lookup = lookup;
module.exports.insert = insert;
module.exports.remove = remove;
module.exports.update = update;