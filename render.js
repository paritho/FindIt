'use strict';

let fs = require('fs');

// caching for quicker load
let files = {};

function serve(file, res){
    
    if(!files[file.path]){
        
        fs.readFile(file.path, function(err,data){
            if(err) {
                // TODO: send error page
                console.log('there was an error reading the file', err.message);
                res.end();
                return;
            }
            res.writeHead(200,{'Content-Type':file.ct});                
            res.end(data);

            files[file.path] = {
                'ct':file.ct,
                'content':data
            };

        });
        return;
    }
    
    res.writeHead(200,{'Content-Type':files[file.path].ct});
    res.end(files[file.path].content);
    
    
}
        
module.exports.serve = serve;