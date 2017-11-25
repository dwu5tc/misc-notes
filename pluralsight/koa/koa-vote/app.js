var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();
var serve = require('koa-static'); // serve static files

app.use(serve(__dirname + 'public'))

// routes
var homeRoutes = require('./routes/homeRoutes.js');
app.use(route.get('/', homeRoutes.showHome));

var questionRoutes = require('./routes/questionRoutes.js');
app.use(route.get('/question', questionRoutes.showNewQuestion));
app.use(route.post('/question', questionRoutes.addQuestion));

app.listen(3000);
console.log('LOP 3000');