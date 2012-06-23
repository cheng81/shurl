module.exports = {
	home: function(req, res) {
		res.render('index', {
			locals: {
				title: 'ShURL',
				description: 'a tiny URL shortener',
				author: 'fzan'
			}
		});
	},
	report: function(req, res) {
		res.render('reportFrm', {
			locals: {
				title: 'ShURL',
				description: 'a tiny URL shortener',
				author: 'fzan'
			}
		});
	}
};