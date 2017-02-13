'use strict';

function add(path, handler){ 
    // TODO: implement dynamic routing
    // for customer's domains: uakron.findit.com
}
        
function parse(url){
    let match = url.path.match(/(\w+)(\.[a-z]+)$/);

    if(match) {
        let ext = match[2],
            path = './assets',
            ct;

        switch(ext){
            case ".css":
                ct = 'text/css';
                break;
            case ".html":
                ct = 'text/html';
                break;
            case ".js":
                path = './assets/js';
                ct = 'application/javascript';
                break;
            case ".jpg":
                path = './assets/images';
                ct = 'image/jpeg';
                break;
            case ".ico":
                ct = 'image/ico';
                break;
        }
        
        path += match['input'];
           
        return {
            "path": path,
            "ct" : ct
        }
    }
            
    if(url.path.indexOf('/api/')>-1) {
        // TODO: implement the API
        // /api/stack/:id/:action
        console.log('api request');
        return {};
    }
            
}
    

module.exports.parse = parse;