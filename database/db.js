'use strict';

let fs = require('fs'),
    dbPath = './database/stackdata2.json',
    dirty = false,
    locked = false,
    db = {};

let lockDB = function lock(){locked = true;}

let unlockDB = function unlock(){locked = false;}

function isLocked(){return locked;}

// load data into memory
// changes database to be indexed by stack id for
// fast lookup
let loadDB = function(path){
    // we don't want to write to disc while loading
    dirty = false; 
    lockDB();

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
    unlockDB();
}
loadDB(dbPath);
 
// check every second if data was added or removed
// from the in-memory file. If so, write the data to disc
(function monitorDB(){
    let check = setInterval(function(){
        if(!dirty || isLocked()) return;
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
    if(isLocked()) {
        // db busy, wait
    }
    return db[id];
}

function insert(data){
    // lock other access to db
    lockDB();

    let id = data.id;
    if(lookup(id)) {
        db.unlock();
        return false;
    }

    let obj = {};
    for(let prop in data){
        obj[prop] = data[prop];
    }

    db[id] = obj;
    unlockDB();

    // tell monitorDB we changed something
    dirty = true; 
    return true;
}

function update(data){
    // if submitted data equals the existing data return
    if(db[data.id].callNumbers.start.full == data.callNumbers.start.full) return true;

    if(!lookup(data.id)) return false;

    lockDB();

    db[data.id] = data;
    unlockDB();
    dirty = true;
    
    return true;
}

function remove(id){
    lockDB();
    delete db[id];
    unlockDB();

    dirty = true;    
    return lookup(id) ? false : true; 
}

module.exports.lookup = lookup;
module.exports.insert = insert;
module.exports.remove = remove;
module.exports.update = update;
module.exports.isLocked = isLocked;