var store = require('./store')
  , request = require('request')
  , url = require('url');

var getHash = function(urlobj) {
	var out = url.format(urlobj).trim().replace(/[^a-zA-Z 0-9]+/g,'+'); //for some reasons, secondary indexes just get crazy with "strage" chars
	console.log('stripped',out);
	return out;
};

var make = function(urlobj, callback) {
	var hash = getHash(urlobj);

	store.existsHash(hash, function(err, resp) {
		if(err) {return callback(err);}
		if(resp) {
			console.log('object exists: ',resp);
			return callback(null,resp);
		} else {
			createKey(function(err,key) {
				if(err) {return callback(err);}
				var obj = {
					key: key,
					urlobj: urlobj,
					reported: 0,
				};
				store.save(key,hash,obj,function(err,empty,meta) {
					fetchTitle({data:obj,meta:meta}, function(err,title) {
						if(err) {
							console.log('something went wrong',err);
						} else {
							console.log('fetched title',title);
						}
					});
				});
				callback(null,key);
			});
		}
	});
};
var format = function(obj, qs) {
	//merge querystrings
	if(qs && qs instanceof Object) {
		if(!obj.urlobj.query) {obj.urlobj.query = {};}
		for(var i in qs) {
			if(qs.hasOwnProperty(i)) {
				obj.urlobj.query[i] = qs[i];
			}
		}
	}
	return url.format(obj.urlobj);
};

var createKey = function(callback) {
	store.count(function(err, count) {
		if(err) {return callback(err);}
		var k = count.toString(36);
		while(k.length<4) {k='0'+k;}
		return callback(null, k);
	});
};

var re = new RegExp("<title>(.*?)</title>",'i');
var fetch = function(obj, callback) {
	request({
		uri:obj.data.urlobj,
		encoding: 'utf8'
		}, function(err, resp, body) {
		if(!err && resp.statusCode===200) {
			var match = re.exec(body);
			if(match) {
				return callback(null,match[1]);
			}
			return callback(null,"No Title Found");
		} else {
			if(err) {return callback(err);}
			else return callback(new Error('Wrong HTTP response code '+resp.statusCode));
		}
	});
};

var fetchTitle = function(obj, cb) {
	fetch(obj, function(err, title) {
		if(err) {return cb(err);}
		var enctitle = encodeURIComponent(title);
		obj.data.title = enctitle;
		store.update(obj.data,obj.meta);
		cb(null,title);
	});
};

module.exports = {
	get: function(key, cb) {
		store.get(key,cb);
	},
	report: function(obj) {
		obj.data.reported++;
		store.update(obj.data,obj.meta);
	},
	dereport: function(obj) {
		if(obj.data.reported>0) {
			obj.data.reported--;
			store.update(obj.data,obj.meta);
		}
	},
	fetchTitle: fetchTitle,
	make: make,
	format: format,
	remove: store.remove
};