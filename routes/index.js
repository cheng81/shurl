
/*
 * routes
 */

var common = require('./common')
  , title = require('./title')
  , reports = require('./reports')
  , shurl = require('./shurl')


module.exports = {
	home: common.home,
	reportFrm: common.report,
	title: title,
	report: reports.report,
	dereport: reports.dereport,
	shurl: shurl.make,
	redir: shurl.redir
};
