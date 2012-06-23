var Shurl = require('../lib');

module.exports = function(req, res) {
	if(req.obj.data.title===undefined) {
		Shurl.fetchTitle(req.obj, function(err, title) {
			if(err) {throw err;}
			res.send(title, {'Content-Type': 'text/plain'}, 200);
		});
	} else {
		res.send(req.obj.data.title, {'Content-Type': 'text/plain'}, 200);
	}
};