'use strict';

var fs = require('fs');

var files = {};

function serve(path, res){
    var rgx = /(\/stacks\/)(\w+)(\..+)/i;
    var destructedURL = path.match(rgx);
    
    if(!destructedURL){
        fs.readFile('404.html',function(err,data){
            if(err) {
                res.writeHead(500, {'Content-Type':'text/html'});
                res.end("Something went really wrong. Sorry");
                return;
            }
            
            res.writeHead(404, {'Content-Type':'text/html'});
            res.end(data);    
        });
        
        return false;
    }
    
    // ct = content type, ext = file extension
    // ct is at pos 2, ext is at pos 3
    var ct,
        ext = destructedURL[3];
        
    path = destructedURL[2]+ext;
    // this doesn't work. somehow, the files obj is not persisting.
    console.log(files);
    if(files[path]) {
        console.log('found ' +path+' in memo');
        res.writeHead(200,{'Content-Type':files[path].ct});
        res.end(files[path].content);
        return;
    } 
    

    switch(ext.toLowerCase()){
         case '.css':
            ct = 'text/css';
            break;
        case '.js':
            ct = 'application/javascript';
            break;
        case '.json':
            ct = 'application/json';
            break;
        case '.ico':
            ct = 'image/ico';
            break;
        case '.jpg':
            ct = 'image/jpg';
            break;
        default:
            ct = 'text/html';
    }
    
    fs.readFile(path,function(err,data){
        if(err) // sendError
        
        files[path] = {
            'ct':ct,
            'ext':ext,
            'content': data
        }
        
        
        res.writeHead(200, {'Content-Type': ct});
        res.end(data);
    });
}

module.exports.serve = serve;