var url = require('url')
  , Shurl = require('../lib');

var make = function(req, res) {
	var toShorten = req.body.url.trim();
	if(toShorten.indexOf('http')!==0) {toShorten = 'http://' + toShorten;}
	var urlObj = url.parse(toShorten,true);
	Shurl.make(urlObj, function(err, key) {
		if(err) {
			throw err;
		}
		res.send(key, {'Content-Type':'text/plain'}, 201);
	})
};

var redir = function(req, res) {
	var theUrl = Shurl.format(req.obj.data, req.query);
	if(req.obj.data.reported===0) {
		res.redirect( theUrl );
	} else {
		res.render('reported', {
			locals: {
				title: 'ShURL',
				description: 'a tiny URL shortener',
				author: 'fzan',
				key: req.obj.data.key,
				url: theUrl,
				times: req.obj.data.reported,
				urltitle: req.obj.data.title
			}
		})
	}
	
};

module.exports = {
	make: make,
	redir: redir
};