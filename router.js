'use strict';
var Render = require('render.js');

module.exports = function(){
    return {
        routes:[],
        
        add:function(path, handler){ 
            // TODO: implement dynamic routing
            // for customer's domains: uakron.findit.com
        },
        
        parse:function(url){
            
            if(url.indexOf('/assets/')>-1) {
                let fullFileName = url.match(/(\w+)(\.[a-z]+)$/);
                let file = fullFileName ? fullFileName[1] : 'error';
                let ext = fullFileName ? fullFileName[2] : 'html';
                let ct;
                
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
                
                routes.push({
                    "file":fullFileName,
                    "ct" : ct;
                });
            }
            
            if(url.indexOf('/api/')>-1) {
                // TODO: implement the API
                // /api/stack/:id/:action
            }
            
            return this.routes;
        }
        
        
    }
    
}