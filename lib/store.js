var db = require('riak-js').getClient({
	host: process.env.npm_package_config_riakhost || 'localhost', 
	port: process.env.npm_package_config_riakport || '8098',
	debug:true});

var bucket = 'shurls';

module.exports = {
	save: function(id,hash,obj,cb) {
		// need to store the hash into the object too.
		// apparently, indexes get, uh, lost
		obj.hash = hash;
		db.save(bucket, id, obj, {
			contentType: 'application/json',
			index: {hash: hash}
		},cb);
	},
	update: function(data,meta,cb) {
		// this is funny, trying to directly save the object and meta
		// will result in corruption -or something similar- of the data
		// itself (subsequent "get" will fail because of premature end of input)
		db.get(bucket,data.key, function(err,value,meta) {
			if(!(meta.index)) {meta.index = {hash:data.hash};}
			db.save(bucket, data.key, data, meta);
		});
	},
	get: function(key, cb) {
		db.get(bucket, key, function(err,value,meta) {
			if(err) {return cb(err);}
			return cb(null,{meta:meta,data:value});
		});
	},
	remove: function(obj) {
		db.remove(bucket, obj.key);
	},
	existsHash: function(hash, cb) {
		db.query(bucket,{hash:hash},function(err,resp) {
			if(err) {return cb(err);}
			if(resp.length>0) {return cb(null,resp[0]);}
			return cb();
		});
	},
	count: function(cb) {
		db.count(bucket,cb);
	}
};