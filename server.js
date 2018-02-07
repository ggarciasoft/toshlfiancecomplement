//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var express = require('express');
var rp = require('request');


var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

function getHeaders(clientId) {
   
    return {
        'Postman-Token': '5f70fdce-4d3c-5c7a-1f5b-e917a5eb55a7',
        'Cache-Control': 'no-cache',
        'Authorization': getBasicAuthorization(clientId)
    };
}

function getBasicAuthorization(clientId){
    return "Basic " + Buffer.from(clientId + ':').toString('base64');
}

function getOption(path, clientId) {
    var options = {
        method: 'GET',
        url: 'https://api.toshl.com/' + path,
        headers: getHeaders(clientId)
    }

    return options;
}

router.get('/accounts', function (req, res, next) {
    var options = getOption("accounts", req.query.clientId);
    rp(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.json(body);
    });
})

router.get('/budgets', function (req, res, next) {
    var options = getOption("budgets");
    options.qs = { from: '2018-02-01', to: '2018-02-28' };
    rp(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.json(body);
    });
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Start: ", addr.address + ":" + addr.port);
});
