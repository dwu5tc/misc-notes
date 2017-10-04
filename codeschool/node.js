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
	console.log('ERR: ' + message);
});

logger.emit('error', 'SOME ERROR');

// Class: http.Server is an EventEmitter with the follow events
// Event: 'request'
// function(request, response) {} 
// emitted each time there is a request
// Event: 'close'
// function() {}
// emitted when the server closes

http.createServer(function(req, res) {..}); 

http.createServer(); // above can be rewritten to...
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

// file.on('readable', function() {
// 	var chunk = null;
// 	while ((chunk = file.read()) !== null) {
// 		console.log(chunk.toString());
// 	}
// });
file.pipe(process.stdout);


file.pipe(destFile, { end: false }); // keep the stream open 


