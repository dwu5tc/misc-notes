/*
 * INTRODUCTION
 */

// callback free --> uses generators for non-blocking async
// relies heavily on MW

// npm install koa --save
// app.js
var koa = require('koa');
var app = koa();

app.use(function *() { // generator function
	this.body = 'hello world';
});

app.listen(3000);
console.log('lop 3000');
// node --harmony app.js

// app2.js
var koa = require('koa');
var app = koa();

var route = require('koa-route');
var parse = require('co-body'); // MW which parses incoming request into an obj

var monk = require('monk'); // wrapper around the mongo driver
var wrap = require('co-monk'); // monk = not generator friendly, use co-monk wrapper around monk
var db = monk('localhost/koa_users');
var users = wrap(db.get('users')); // db.get() gets the collection --> wrap it with co-monk to make it generator friendly

app.use(route.post('/user', saveUser));
app.use(route.post('/user:id', getUser));

function *saveUser() {
	// parse user from the sent request
	var userFromRequest = yield parse(this); // node will wait here until it gets called back (without using cb funcs)

	// store it in db
	var user = yield users.insert(userFromRequest); // no other MW here --> telling node it can do other things; e.g serve next request 

	// return status and resource
	this.body= user;
	this.set('location', '/user/' + user._id); // id created by mongo
	this.status = 201; // 201 for created ok
}

function *getUser(id) {
	var user = yield users.findById(id);

	this.body = user;
	this.status = 200; // ok
}

app.listen(3000);
console.log('lop 3000');

/*
 * YIELD AND GENERATORS
 */

function *differentStuff() {
	yield 21;
	yield { title: 'foo', content: 'bar' };
	yield 'a string';
}

// whats happening here?
// 21 yielded --> wait for .next call on generator
// like callback without the callback

// co library (for co-routine)
var co = require('co'); // wrapper for generator function; will just keep calling .next on the func until sequence ends
var wait = require('co-wait'); // a yieldable wait function???

co(function *() {
	console.log('started');
	console.time('sequence');

	yield wait(1000);
	yield wait(2000);
	yield wait(3000);

	console.timeEnd('sequence');
	console.log('completed');
})();
// logs ~6000ms

// async
co(function *() {
	console.log('started');

	var a = wait(1000);
	var b = wait(2000);
	var c = wait(3000);

	console.time('parallel');

	var res = yield [a, b, c];

	console.timeEnd('parallel');
	console.log('completed');
})();
// logs ~3000ms

// koa uses co internally --> lets us write expressive and simple but non-blocking code

// MW example
var koa = require('koa');
var app = koa();

app.use(function *xResponseTime(next) {
	var start = new Date(); // save date -->
	yield next; // do whatever next MW does -->

	var ms = new Date() - start; // back here once done
	this.set('X-Response-Time', ms +' ms');
});

app.use(function *consoleLogger(next) {
	var start = new Date();
	yield next;

	var ms = new Date() - start;
	console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function *() {
	this.body = 'hello world!'; // last MW = the application itself
});

app.listen(3000);

// since no more callbacks with error obj as first parameter
// use try catch blocks
function *saveUser() {
	var userFromRequest = yield parse(this); // don't need to surround this with try/catch???
	try {
		var user = yield users.insert(userFromRequest);
	}
	catch(e) {
		this.body = 'error occurred: ' + e;
		this.status = '401';
		return;
	}
	finally {}
	this.body = user; // e.g has scope issue???
	this.set('location', '/user/' + user._id);
	this.status = 201;
}

// try to yield control back to node with any I/O or networking; anything taking some time to complete
// aka anything which would typically require callbacks

/*
 * CONCEPTS
 */

// application obj = one that you configure your app with
// context obj = an encapsulation of the request and response object (inside 'this')

// read method of the incoming request? --> this.method
// set the response body? this.body

var koa = require('koa');
var app = koa();
module.exports = koa;

// or
var app = module.exports = require('koa')();

// .listen()

// .use();
// including and using MW

var app =  require('koa')();
app.use(function *() {
	console.dir(this.request);
});
// takes incoming request and handles it by putting it out on the console

var logger = require('koa-logger');
app.use(logger());
app.use(function *() {
	this.body = 'hello world!';
});

// writing cascading MW
app.use(function *logger(next) {
	console.log('before');
	yield next;
	console.log('after');
});
app.use(function *() {
	console.log('in application');
	this.body = 'logged';
});
// cascading MW vs noncascading???

// request object; koa req obj = wrapper of the node req obj

// this.request
// request.header returns header
// request.method returns GET, POST, DELETE, etc
// request.url reads url the req came from
// request.path...
// request.querystring...

// is() --> this.request.is('json') 
// accepts() --> this.request.accepts('json', 'html', ...)
// get a hold of the node raw??? request obj --> this.request.req

// response object --> this.response
// response.body --> ...
// response.status --> ... = 418
// response.type --> = ... = 'application/json'

// set() --> this.response.set('location', '...')
/* or this.response.set({
	// some object
}); */
// redirect() performs 302 moved temporarily 
// this.response.res

// context obj (don't even have to remember req and res)
// can drop request and response... LOL 

// e.g
app.use(function *() {
	var bodyParsed = yield parse(this);

	if (this.method === 'POST') this.body = 'you posted: ' + bodyParsed.name;
	if (this.method === 'GET') this.body = 'the path was ' + this.path;

	this.status = 200;
	this.body += '</br>request handled';
});

/*
 * BUILDING AN HTTP API
 */

// userAPI/
// 		app.js
//		test.js
//		userRoutes.js

// userRoutes.js
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/apiUsers');
var users = wrap(db.get('users'));
module.exports.users = users;

module.exports.addUser = function *addUser() {
	var userFromRequest = yield parse(this);

	if (!userFromRequest.name) {
		this.throw(400, 'name required');
	}

	var insertedUser = yield users.insert(userFromRequest);

	this.set('location', '/user/' + insertedUser._id);
	this.status = 200;
}

module.exports.getUser = function *getUser(id) {
	var user = yield users.findById(id);

	this.body = user;
	this.status = 200;
}

module.exports.updateUser = function *updateUser(id) {
	var userFromRequest = yield parse(this);

	yield users.updateById(id, userFromRequest);

	this.set('location', '/user/' + id);
	this.status = 204;
}

module.exports.deleteUser = function *deleteUser(id) {
	yield users.remove({ _id: id });
	this.status = 200;
}

// app.js
var koa = require('koa');
var app = module.exports = koa();
var routes = require('koa-route');

// routes
var userRoutes = require('./userRoutes');
app.use(routes.post('/user', userRoutes.addUser));
app.use(routes.get('/user/:id', userRoutes.getUser));
app.use(routes.put('/user/:id', userRoutes.updateUser));
app.use(routes.del('/user/:id', userRoutes.deleteUser));

app.listen(3000);
console.log('lop 3000');

// test.js --> using mocha
var app = require('./app');
var request = require('supertest').agent(app.listen()); // testing done in memory, no server needed
var co = require('co');
var users = require('./userRoutes').users;

describe('simple user http crud api', function() {
	var a_user = {};
	
	beforeEach(function(done) {
		a_user = { name: 'foo', age: 15, height: 1.75 };
		removeAll();
		done();
	});

	afterEach(function(done) {
		removeAll();
		done();
	});

	// prevent side-effects during testing
	var removeAll = function(done) { // utility function that removes all users in db
		// co wrapped so we can use generator-friendly users collection
		co(function *() {
			// call remove method with no filter obj aka remove all objs in db
			yield users.remove({});
		})(done);
	}

	it('adds new users', function(done) {
		request
			.post('/user')
			.send(a_user)
			.expect('location', /^\/user\/[0-9a-fA-F]{24}$/) // regex
			.expect(200, done);
	});

	it('fails with validation error for users without name', function(done) {
		delete a_user.name; // remove name property

		request
			.post('/user')
			.send(a_user)
			.expect('name required')
			.expect(400, done);
	});

	it('get existing user by id', function(done) {
		co(function *() {
			// insert test user in db
			var insertedUser = yield users.insert(a_user); // yield doesnt work unless we wrap with co

			// get url to user
			var url = '/url/' + insertedUser._id;

			// get via api
			request
				.get(url)
				.set('accept', 'application/json')
				.expect('content-type', /json/)
				.expect(/foo/) // don't we need another line for age???
				.expect(/1.75/)
				.expect(200, done);
		})();
	});

	it('updates an existing user', function(done) {
		co(function *() {
			var insertedUser = yield users.insert(a_user);
			var url = '/user/' + insertedUser._ud;

			request
				.put(url)
				.send({ name: 'updated foo', age: 16, height: 175 })
				.expect('location', url) // expect location = same url the user was found at 
				.expect(204, done); // 204 = no content
		});
	});

	it('deletes an existing user', function(done) {
		co(function *() {
			var insertedUser = yield users.insert(a_user);
			var url = '/user/' + insertedUser._ud;

			request
				.del(url)
				.expect(200, done); // 204 = no content
		});
	})
});
// npm install supertest mocha --save-dev
// add "./node_modules/mocha/bin/mocha --harmony-generators -u bdd -R spec" to npm test scripts
// bdd = using bdd syntax NOT tdd syntax???
// -R spec = humanly readable reporting style
// mocha for writing and running tests
// supertest for running HTTP calls against the koa app

/*
 * BUILDING A COMPLETE WEBSITE
 */

// routes
// get / - home

// get /question - new question form
// post /question - store new question
// get /question/:id - display edit form
// post /question/:id - update question

// get vote?qid=:id - show voting form

// post /vote - store new vote

// get /vote/:id/comment - show add comment
// post /vote/:id/comment - add comment

// get /results - show result filter form
// post /result - renders report in excel



