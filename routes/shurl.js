var url = require('url')
  , Shurl = require('../lib');

var re = /^[a-z0-9]+$/;
var checkShurl = function(urlObj, referer) {
	if(!referer) {return false;} //cannot check
	var refUrl = url.parse(referer);
	if(refUrl.host===urlObj.host) {
		//suspiciously the same host
		//check if the path has only one element
		var path = urlObj.path.substr(1);
		if(path.length>0&&(path.indexOf('/')<0)) {
			//even more suspiciously, the path has only one element
			if(re.test(path)) {
				//ok, that's definitely a shurl key, you cheater!
				return path;
			}
		}
	}
	return false;
}
var make = function(req, res) {
	var toShorten = req.body.url.trim();
	if(toShorten.indexOf('http')!==0) {toShorten = 'http://' + toShorten;}
	var urlObj = url.parse(toShorten,true);
	var shurlKey = checkShurl(urlObj,req.headers.referer);
	if(shurlKey) {
		console.log('Nice try',shurlKey);
		res.send(shurlKey, {'Content-Type':'text/plain'}, 200);
	} else {
		Shurl.make(urlObj, function(err, key) {
			if(err) {
				throw err;
			}
			res.send(key, {'Content-Type':'text/plain'}, 201);
		});
	}
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