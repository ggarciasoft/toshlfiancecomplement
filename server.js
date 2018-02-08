//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//

if (process.argv == 2) {
    console.error('client id must be provided');
}

var clientId = process.argv[2];

var http = require('http');
var path = require('path');

var express = require('express');
var rp = require('request');


var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

function getHeaders() {

    return {
        'Cache-Control': 'no-cache',
        'Authorization': getBasicAuthorization()
    };
}

function getBasicAuthorization() {
    return "Basic " + Buffer.from(clientId + ':').toString('base64');
}

function getOption(path) {
    var options = {
        method: 'GET',
        url: 'https://api.toshl.com/' + path,
        headers: getHeaders()
    }

    return options;
}

router.get('/accounts', function (req, res, next) {
    var options = getOption("accounts");
    rp(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.json(body);
    });
})

router.get('/budgets', function (req, res, next) {
    var options = getOption("budgets");
    var date = getCurrentDay();
    options.qs = { from: date, to: date };
    rp(options, function (error, response, body) {
        if (error) throw new Error(error);

        res.json(body);
    });
})

router.get('/entriessum', function (req, res, next) {
    var fromDate = req.query.from;
    var toDate = req.query.to;
    var options = getOption("entries/sums");
    options.qs = { from: fromDate, to: toDate, currency: "DOP" };
    rp(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.json(body);
    });
})

function getCurrentDay() {
    var date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getFirstDay() {
    var date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-01`;
}

function getLastDay() {
    var date = new Date();
    date.setMonth(date.getMonth() + 1);
    date = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    date.setMilliseconds(-1);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Start: ", addr.address + ":" + addr.port);
});
