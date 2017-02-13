'use strict';

var URL = require('url');
var renderer = require('./render.js');


function route(req,res){
    var url = URL.parse(req.url);
    
    if(url.path.indexOf('.ico') > 0) return;
    
    renderer.serve(url.path,res);
    
}

function sendError(msg,code){
    code = code ? code : 404;
    res.writeHead(code,{'Content-Type':'text/html'});
    res.end(msg);
}



module.exports.route = route;
module.exports.sendError = sendError;

