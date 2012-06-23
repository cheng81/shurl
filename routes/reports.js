
var Shurl = require('../lib');

var report = function(req, res) {
	Shurl.report(req.obj);
	res.json(true,200);
};

var dereport = function(req, res) {
	Shurl.dereport(req.obj);
	res.json(true,200);
};

module.exports = {
	report: report,
	dereport: dereport
};