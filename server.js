'use strict';

let http = require('http');
let https = require('https');
let Router = require('./router.js');
let Render = require('./render.js');

let server = http.createServer();

server.on('request',Router.parse);

server.listen(3333,'130.101.224.143', function(){console.log("server listening on 3333")});

