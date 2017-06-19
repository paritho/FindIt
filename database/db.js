'use strict';

let SearchDb = require('../search.js');
let fs = require('fs'),
    dbPath = './database/stackdata2.json',
    dirty = false,
    locked = false,
    db = {},
    searchableDB;

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

    // loadDB is called at program start, and when data is written to disc
    // so when we reach this point we need to instantiate a new copy of
    // the searchable db
    //searchableDB = SearchDb.buildSearchableDB(db);
    //console.log(searchableDB);
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
    //console.log(str);

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

    let id = data.id;
    if(lookup(id)) return false;

    let obj = {};
    for(let prop in data){
        obj[prop] = data[prop];
    }

    db[id] = obj;

    // tell monitorDB we changed something
    dirty = true; 
    return true;
}

function update(data){
    if(!lookup(data.id)) return false;
    
    db[data.id] = data;

    dirty = true;
    
    return true;
}

function remove(id){
    delete db[id];

    dirty = true;    
    return lookup(id) ? false : true; 
}


// Search the db by call number and return the stack id
function search(number){
    // number => {}
    // when processing the call number we only use starting call number
    let fLetter = number.callNumbers.start.letters[0],
        sLetter = number.callNumbers.start.letters[1],
        rank = number.callNumbers.start.rank,
        floor = number.callNumbers.floor,
        id = -1;

    let range = searchableDB[fLetter][sLetter];

    if(!range) return id;
    
    // do the search. O(n) in the worst case
    for(let num in range){
        // we're only looking at the last call number for a stack
        // so start at beginning, once num is less than rank we 
        // have found it
        if(rank < num) return range[num];
    }

    return id;

}



module.exports.lookup = lookup;
module.exports.insert = insert;
module.exports.remove = remove;
module.exports.update = update;
module.exports.isLocked = isLocked;
module.exports.search = search;