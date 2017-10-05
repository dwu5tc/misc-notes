/*
 * INTRO
 */


var express = require('express');
var app = express();

app.get('/', function(req, res) { // creates route that accepts get requests
	// res.send('hello world');
	res.write('hello world'); // same as send but write is a node function
	res.end();
});

app.listen(3000, function() { // binds app to tcp port 3000
	console.log('listening on port 3000');
});
// run with node app.js
// curl http://localhost:3000/ to send a request
// --------------------

// send function converts objs and arrays to JSON
app.get('/blocks', function(req, res) {
	var blocks = ['fixed', 'movable', 'rotating'];
	res.send(blocks);
	// res.json(blocks); // this works as well
});
// curl -i http://localhost:3000/blocks 
// -i prints response headers

// HTTP/1.1 200 OK
// X-Powered-By: Express
// Content-Type: application/json; charset=utf-8
//
// ['fixed', 'movable', 'rotating']
// <ul><li>fixed</li><li>movable</li></ul>

var blocks = '<ul><li>fixed</li><li>movable</li></ul>';
res.send(blocks);
// curl to .../blocks

// Content-Type: text/html; charset=utf-8
// --------------------

// redirection
app.get('/blocks', function(req, res) {
	res.redirect('/parts');
});
// curl to .../blocks

// HTTP/1.1 302 Moved Temporarily
// X-Powered-By: ...
// Location: /parts
// Content-Type: ...
// 
// Moved Temporarily. Redirecting to /parts
// --------------------

res.redirect(301, '/parts'); // would return...
// HTTP/1.1 301 Moved Permanently
// ...
// Moved Permanently. Redirecting to /parts



/*
 * MIDDLEWARE
 */


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public')); // does same thing as above
// defaults to serving index.html 
// for static pages

app.listen(3000);
// --------------------


// ajax calls

// app.js
// public/
//	  index.html
//	  blocks.png
//	  jquery.js
//	  client.js

// index.html
/*
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Building Blocks</title>
	<link rel="stylesheet" href="style.css" />
</head>
<body>
	<h1>Blocks</h1>
	<p><img src="blocks.png" alt=""></p>

	<ul class="block-list"></ul>

	<script src="jquery.js"></script>
	<script src="client.js"></script>
</body>
</html>
*/

// client.js
$(function() {
	$.get('/blocks', appendToList); // return val of ajax call passed as argument into appendToList

	function appendToList(blocks) {
		var list = [];
		for (var i in blocks) {
			list.push($('<li>', { text: blocks[i] })); // create li element with text set to block name
		}
		$('.block-list').append(list);
	}
});

// app.js
var express = require('express');
var app = express();

app.get('/blocks', function(res, req) {
	var blocks = ['fixed', 'movable', 'rotating'];
	res.json(blocks);
});

app.listen(3000);
// --------------------

// custom middleware
// reports duration of each request

// app.js
// logger.js
// public/
// 	  ...

// logger.js
module.exports = function(req, res, next) { // export it as a node module and make accessible to other files
	var start = +new Date(); // + sign converts date obj to milliseconds since [...]
	var stream = process.stdout; // stdout = writeable stream which we will write the log to
	var url = req.url;
	var method = req.method;

	// res obj = an EventEmitter
	res.on('finish', function() { // event handler function runs asynchronously
		var duration = +new Date() - start;
		var message = method + ' to ' + url +
			'\n took ' + duration + ' ms \n\n';
		stream.write(message);
	});
	next();
};

// app.js
var express = require('express');
var app = expresS();

var logger = require('./logger');
app.use(logger);

app.use(express.static('public'));

app.get('/blocks', function(...) {...});

app.listen(3000, function(...) {...});

// node app.js

// GET to /
// took 8ms
//
// GET to /jquery.js
// took 3ms
// 
// GET to /client.js
// took 6ms
// 
// ...
// each request runs through the middleware before resolving and responding to the client???
// --------------------


// only GET requests middleware
module.exports = function(req, res, next) {
	if (req.method === 'GET') {
		next();
	}
	else { // pretty sure no need for else (since next would exit the function)but for sake of clarity
		res.send('method not allowed');
	}
};


/*
 * USER PARAMS
 */


// query string parameters (from url)
app.get('/blocks' function(req, res) {
	...
	if (req.query.limit >= 0) {
		res.json(blocks.slice(0, req.query.limit));
	}
	else {
		res.json(blocks);
	}
});
// curl http://localhost:3000/blocks?limit=1

// returns ['fixed']
// curl with limit=2 returns ['fixed', 'movable']
// --------------------


// dynamic routes
var blocks = {
	'fixed': 'not movable',
	'movable': 'can be moved',
	'rotating': 'circular motion'
};
// res.json(Object.keys(blocks)); 
// returns the keys

app.get('/blocks/:name', function(req, res) {
	var desc = blocks[request.params.name];
	res.json(desc); // defaults to 200 success
});
// curl -i http://localhost:3000/blocks/fixed

// HTTP/1.1 200 OK
// 'not movable'

// *** curl to /blocks/banana would return successful status code but with blank response
// handle this by returning 404 status codes with explanation
...
if (!desc) {
	res.status(404).json('no descrption found for ' + req.params.name);
}
...


// normalizing the request parameter
...
var name = req.params.name;
var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
var desc = blocks[block];
if (!desc) {...}
...


// app.param function maps placeholders to callback functions
// useful for running pre-conditions on dynamic routes
...
app.param('name', function(req, res, next) {
	var name = req.params.name;
	var block = name[0].toUpperCase() + name.slice(1).toLowerCase();

	req.blockName = block; // req.blockName can be accessed from other routes in the app // why is this useful???
	next();
});
...
...
app.get('/blocks/:name', function(req, res) {
	var desc = blocks[req.blockName];
});
...
...
app.get('locations/:name', function(req, res) {
	var location = locations[req.blockName];
});
...

/*
 * BODY PARSER
 */



 /*
  * REFACTORING ROUTES
  */