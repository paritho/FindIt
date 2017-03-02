'use strict';

let Render = require('./render.js');
let API = require('./api.js');
let URL = require('url');


function add(path, handler){ 
    // TODO: implement dynamic routing
    // for customer's domains: uakron.findit.com
}
        
function parse(req, res){
    let url = URL.parse(req.url);
    
    // home route
    if(url.path == '/') {
        Render.serve({
            "path": './assets/index.html',
            "ct":{'Content-Type':'text/html'}
        }, res);
        return;
    }
    
    // POST api route
    if(url.path.indexOf('/api/')>-1) {
        // /api/stack/:id/:action
        console.log('api request in', req.method);
        
        if(req.method === 'POST'){
            let body = '';
            req.on('data',function(data){
                body += data;
                // kill if too much data
                if(body.length > 1e6) req.connection.destroy();
            });
            req.on('end',function(){
                Render.serve(API.postRoute(body),res);
            });
        }
        
        
        // GET api route
        if(req.method === 'GET'){
            // /api/stack/:id
            if(url.path.indexOf('/stacks/'>-1)) {
                Render.serve(API.getRoute(url), res);
            }
            
        }
        
        
        
        return;
    }
    
    // assets route
    let match = url.path.match(/(\w+)(\.\w+)$/);

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
           
        Render.serve({
            "path": path,
            "ct" : ct
        }, res);
    }
    
    // error route
            
}
    

module.exports.parse = parse;