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
})


/*
 * MIDDLEWARE
 */


/*
 * USER PARAMS
 */


/*
 * BODY PARSER
 */

 /*
  * REFACTORING ROUTES
  */