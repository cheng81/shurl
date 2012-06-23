
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Shurl = require('./lib');

var app = module.exports = express.createServer();

// Configuration

var port = process.env.npm_package_config_port || 8080

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get ('/', routes.home);
app.get ('/Report',routes.reportFrm);
app.post('/Report/:key', routes.report);
app.del ('/Report/:key', routes.dereport);
app.post('/Shurl', routes.shurl);
app.get ('/Title/:key', routes.title);
app.get ('/:key', routes.redir);

app.param('key', function(req, res, next, id) {
  Shurl.get( id, function(err, obj) {
    if(err) { return next(err); }
    if(!obj) { return next(new NotFound('url not found')); }
    req.obj = obj;
    next();
  });
});

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;

app.error(function(err, req, res, next){
  if(err instanceof NotFound) {
    res.render('404.ejs', { locals: { error: err }, status: 404 });
  } else {
    res.render('500.ejs', { locals: { error: err }, status: 500 }); 
  }
});

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
