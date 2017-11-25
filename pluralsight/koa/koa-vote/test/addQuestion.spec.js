var app = require('./../app.js');
var request = require('supertest').agent(app.listen());

describe('adding questions', function() {
	var a_question_form = {
		questionTitle: 'A question?',
		tagString: 'tag1, tag2, tag3'
	};

	it('has nice page to add questions', function(done) {
		request
			.get('/questions')
			.expect(200)
			.expect('Content-Type', /html/)
			.end(done);
	});

	it('stores correct formatted forms as new question', function(done) {
		request
			.post('/question')
			.send(a_question_form)
			.exoect(302) // redirect
			.expect('location', /^\/question\/[0-9a-fA-F]{24}$/) // /question/:id
			.end(done);
	});
});