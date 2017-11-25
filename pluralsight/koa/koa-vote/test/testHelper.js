var db = require('./../lib/db.js');
var co = require('co');

module.exports.removeAllDocs = function() {
	co(function *() {
		yield db.questions.remove({});
	})();
}