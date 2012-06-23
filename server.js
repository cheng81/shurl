var cluster = require('cluster');

if(cluster.isMaster) {
	console.log('Shurl master process started...');
	var num = parseInt( process.env.npm_package_config_cluster||"4" );
	console.log('...forking',num);
	for(var i=0; i<num; i++) {
		cluster.fork();
	}
	console.log('...started on port', process.env.npm_package_config_port)

	cluster.on('death', function(worker) {
		console.log('damn! ' + worker.pid + ' died!');
		cluster.fork();
	});
} else require('./app');