'use strict';

function add(path, handler){ 
    // TODO: implement dynamic routing
    // for customer's domains: uakron.findit.com
}
        
function parse(url){
    let path = url.path;
    
    if(path.indexOf('/assets/')>-1) {
        let fullFileName = path.match(/(\w+)(\.[a-z]+)$/);
        let file = fullFileName ? fullFileName[1] : 'error';
        let ext = fullFileName ? fullFileName[2] : 'html';
        let ct;
        
        console.log(fullFileName);
        console.log(file);
        console.log(ext);
        
        switch(ext){
            case ".css":
                ct = 'text/css';
                break;
            case ".html":
                ct = 'text/html';
                break;
            case ".js":
                ct = 'application/javascript';
                break;
            case ".jpeg":
                ct = 'image/jpeg';
                break;
            case ".ico":
                ct = 'image/ico';
                break;
        }
           
        return {
            "path": './'+path,
            "ct" : ct
        }
    }
            
    if(path.indexOf('/api/')>-1) {
        // TODO: implement the API
        // /api/stack/:id/:action
    }
            
}
    

module.exports.parse = parse;