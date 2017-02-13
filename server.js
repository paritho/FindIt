'use strict';

var http = require('http');
var https = require('https');
var router = require('./router.js');



var server = http.createServer(router.route)
.listen(3333, function(){console.log("server listening on 3333")});

