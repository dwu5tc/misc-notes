var render = require('./../lib/render.js');
var db = require('./../lib.db.js');

module.exports.showHome = function *() {
	var questionsLists = yield db.questions.find({}); // find everything

	this.body = yield render('home', { questions: questionLists });
};