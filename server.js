"use strict;"

var express = require("express");
var app = exports.app = express();
var config = require("config");
var pretty = require('express-prettify');

var bodyParser = require("body-parser");
var expressValidator = require('express-validator')
var db = require('./db/db.js');

// Connect to database
db.initDB(app, "ewalletapi");

// route for static content
app.use(express.static('public'))

// Prettify json responses - by using ?pretty on request
app.use(pretty({ query: 'pretty' }));

// Parses json payloads into req.body
app.use(bodyParser.json({extended : true, limit: '50mb'}));

// use validators, include some of my own
app.use(expressValidator({
	customValidators: {
		gte: function (param, num) {
			return param >= num;
		},
		lte: function (param, num) {
			return param <= num;
		},
		maxlen: function (param, num) {
			return param.length() <= num;
		}
	}
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// Send CORS headers
app.use(function (req, res, next) {
	if (req.headers.origin) {
		var parsed = url.parse(req.headers.origin);
		res.append('Access-Control-Allow-Credentials', 'true');
		res.append('Access-Control-Allow-Origin',
			parsed.protocol + '//' + parsed.host);
		res.append('Access-Control-Allow-Headers',
			req.headers['access-control-request-headers']);
	}
	next();
});

// routes
require('./controllers/main.js')(app);

// Start server
var serverPort = process.env.VCAP_APP_PORT || process.env.PORT || 3000;
var serverHost = process.env.VCAP_APP_HOST || "localhost";

app.set('host', serverHost);
app.set('port', serverPort);

var server = app.listen(serverPort, serverHost, function () {
	var host = server.address().address;
	var port = server.address().port;

	if (process.env.NODE_ENV != 'test') {
		console.error("Node ENV: " + process.env.NODE_ENV + " config: " + config.get('config'));

	}
	// console.log("Server http://%s:%s", host, port);
});

module.exports = app; // for testing