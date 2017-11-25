var render = require('./../lib/render.js');
var parse = require('co-body');

module.exports.showNewQuestion = function *() {
	this.body = yield render('newQuestion')
};

module.exports.addQuestion = function *() {
	var postedData = yield parse(this);

	var questionToStore = 
};