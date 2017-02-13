'use strict';

let http = require('http');
let https = require('https');
let Router = require('./router.js');
let Render = require('./render.js');
let URL = require('url');


let server = http.createServer();


server.on('request',function(req,res){
    let url = URL.parse(req.url);
    let rt = Router.parse(url);
    Render.serve(rt,res);
    
});




server.listen(3333, function(){console.log("server listening on 3333")});

