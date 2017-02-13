'use strict';

let fs = require('fs');

function serve(file, res){
    console.log(file.path);
    fs.readFile(file.path, function(err,data){
        if(err) {
            // TODO: send error page
            console.log('there was an error reading the file', err.message);
            return;
        }
        res.writeHead(200,{'Content-Type':file.ct});                
        res.end(data);
                
        });
}
        
module.exports.serve = serve;