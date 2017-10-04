/*
 * INTRO
 */
var http = require('http');
var fs = require('fs');

// http.createServer([requestLisener])
// returns a new web server object
// requestListener is a function automatically added to the 'request' event
http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	fs.readFile('index.html', function(err, conts) {
		res.write(contents);
		res.end();
		// can also pass contents into res.end() instead of res.write();
	});
}).listen(8080);

// curl http://localhost:8080 --> issues a request 

/*
 *	EVEMTS
 */
var EventEmitter = require('events').EventEmitter;
var logger = new EventEmitter();

logger.on('error', function(message) {
	console.log('err: ' + message);
});

logger.emit('error', 'some kind of error');

// Class: http.Server is an EventEmitter with the follow events
// Event: 'request'
// function(request, response) {} 
// emitted each time there is a request
// Event: 'close'
// function() {}
// emitted when the server closes

http.createServer(function(req, res) {...}); 
// CAN ALSO BE WRITEN AS
http.createServer();
server.on('request', function(req, res) {...});
server.on('close', function() {...});

/*
 * STREAMS
 */
// echoes back request as response
http.createServer(function(req, res) {
	res.writeHead(200);
	// req.on('readable', function() {
	// 	var chunk = null;
	// 	while ((chunk = request.read()) !== null) {
	// 		res.write(chunk);
	// 	}
	// });
	// req.on('end', function() {
	// 	res.end();
	// });
	req.pipe(res); // does same thing as above
}).listen(8080);

// curl -d 'hello' http://localhost:8080
// returns hello on client

// copy a file
var fs = require('fs');
var file = fs.createReadStream('readme.md');
var newFile = fs.createWriteStream('readme_copy.md');

file.pipe(newFile);

// file upload with progress report
http.createServer(function(req, res) {
	var newFile = fs.createWriteStream("readme_copy.md");
	var fileBytes = req.headers['content-length'];
	var uploadedBytes = 0;

	req.on('readable', function() {
		var chunk = null;
		// how much does req.read() "read"???
		while ((chunk = req.read()) !== null) {
			uploadedBytes += chunk.length;
			var progress = (uploadedBytes / fileBytes) * 100;
			res.write("progress: " + parseInt(progress, 10) + "%\n");
		}
	});
	req.pipe(newFile);
}).listen(8080);

// read file and log contents
var fs = require('fs');
var file = fs.createReadStream('fruits.txt');

file.on('readable', function() {
	var chunk = null;
	while ((chunk = file.read()) !== null) {
		console.log(chunk.toString());
	}
});

/*
 * MODULES
 */
// custom_hello.js
var hello = function() {
	console.log('hello');
}
module.exports = hello;

// custom_goodbye.js
exports.goodbye = function() {
	console.log('bye');
}

// app.js
var hello = require('./custom_hello');
var gb = require('./custom_goodbye');

hello();
gb.goodbye(); // or require('./custom_goodbye').goodbye();


// my_module.js
var foo = function() {...}
var bar = function() {...}
var baz = function() {...}

exports.foo = foo;
exports.bar = bar;

// app.js
var myMod = require('./my_module');
myMod.foo();
myMod.bar();


// making HTTP requests
// make_request.js
var http = require('http');

var makeRequest = function(message) {
	var options = {
		host: 'localhost', port: 8080, path: '/', method: 'POST'
	}

	var request = http.request(options, function(res) {
		res.on('data', function(data) {
			console.log(data); // log res body
		});
	});
	request.write(message); // begins req
	request.end();
}

makeRequest('hello world');

module.exports = makeRequest;

// app.js
var makeRequest = require('./make_request');

makeRequest("hello world");
makeRequest("goodbye world");

/*
 * EXPRESS
 */
var express = require('express');
var app = express();

// endpoint at root route which will read file and send back as response
app.get('/', function(req, res) { // root route
	res.sendFile(__dirname + '/index.html'); // __dirname is current directory 
});

app.listen(8080);


// endpoint where user can send in a twitter handle, make a call to twitter, fetch the 10 latest tweets, display back to user
var request = require('request');
var url = require('url');

app.get('/tweets/:username', function(req, res) { // dynamic username
	var username = req.params.username;
	options = {
		protocol: 'http:',
		host: 'api.twitter.com',
		pathname: '/1/statuses/user_timeline.json',
		query: { screen_name: username, count 10 }
	};
	var twitterUrl = url.format(options); // how does this work???
	request(twitterUrl).pipe(res); // no need for err, res, body???
});
// >node app.js
// $curl -s http://localhost:8080/tweets/some_user


// ejs
// looks for templates under the views directory
app.get('/tweets/:username', function(request, response) { // CHANGED TO REQUEST AND RESPONSE 
	var username = req.params.username;
	options = {
		protocol: 'http:',
		host: 'api.twitter.com',
		pathname: '/1/statuses/user_timeline.json',
		query: { screen_name: username, count 10 }
	};
	var twitterUrl = url.format(options);
	request(twitterUrl, function(err, res, body) { 
		var tweets = JSON.parse(body);
		response.locals = { tweets: tweets, name: username };
		response.render('tweets.ejs');
	});
});

// tweets.ejs 
/*
<h1>Tweets for @<%= name %></h1> // <%= for printing things
<ul>
	<% tweets.forEach(function(tweet){ %> <% for doing things???
		<li><%= tweet.text %></li>
	<% }); %>
</ul>
*/


/*
 * SOCKET.IO
 */
 // app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app); // creates http server which dispatches requests to express (the listener)
var io = require('socket.io')(server);
// socket.io and express are now sharing the same http server

// listen for connection events
io.on('connection', function(client) {
	console.log('client connected');

	client.emit('messages', { hello: 'world' });

	client.on('join', function(name) {
		client.nickname = name;
	});

	client.on('messages', function(data) {
		var nickname = client.nickname;
		// console.log(data);
		client.broadcast.emit('message', nickname + ': ' + message); // broadcast message to all other clients connected
		// should 'message' be 'messages'???
		// should message be dat?afa??
		client.emit('messages', nickname + ': ' + message); // ???
	});
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

server.listen(8080);

// index.html (uses jquery)
/*
<script src="/socket.io/socket.io.js"></script>
<script>
	var socket = io.connect(http://localhost:8080);
	socket.on('connect', function(data) {
		$('#status').html('connected to chattr'); 
		nickname = prompt('what is your nickname'); // user enters nickname
		socket.emit('join', nickname); 
	})
	$('#chat_form').submit(function(e) { 
		var message = $('#chat_input').val();
		socket.emit('messages', message);
	})
	socket.on('messages', function(data) {
		// alert(data.hello);
		insertMessage(data); // pretend this is a working function
	});
</script>
*/


 /*
  * PERSISTING DATA
  */


