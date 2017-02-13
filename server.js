'use strict';

let http = require('http');
let https = require('https');
let Router = require('./router.js');
let Render = require('./render.js');


let server = http.createServer();


server.on('request',function(req,res){
    let rt = Router.parse(req.url);
    Render.serve(rt);
    
});




server.listen(3333, function(){console.log("server listening on 3333")});

