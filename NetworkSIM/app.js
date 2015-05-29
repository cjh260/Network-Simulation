var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var multer = require('multer');
var debug = require('debug')('SolidMonkey:server');
var http = require('http');
var fs = require('fs');
var clientHelpers = require('./routes/routeHelpers/clientHelpers');

var admin = require('./simulation/admin');

require('./passport')(passport);

var router = require('./routes/router');
var dbHelp = require('./simulation/dbHelpers');

var mongoUtil = require( './mongoUtil' );
var app;

var appList = [];
var rdtList = [];

mongoUtil.connectToServer(function(err){

	app = express();

	//view engine setup
	app.set('views', path.join(__dirname, 'views'));

	app.set('view engine', 'hjs');

	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(multer({dest: './uploads/'}));
	app.use(cookieParser('foo'));
	app.use(session({ secret: 'foo', resave: false, saveUninitialized: true, store: new MongoStore({ db: mongoUtil.getDb() })}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(require('flash')());
	
	initializeApps();
	initializeRDTS();
	
	app.use(function(req, res, next){
		req.rdtNames = rdtList;
		req.appNames = appList;
		next();
	});

	app.use('/', router);

	//catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	        message: err.message,
	        error: {}
	    });
	});
	/**
	 * Get port from environment and store in Express.
	 */

	var port = normalizePort(process.env.PORT || '3335');
	app.set('port', port);

	/**
	 * Create HTTP server.
	 */

	var server = http.createServer(app);

	/**
	 * Listen on provided port, on all network interfaces.
	 */

	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);

	/**
	 * Normalize a port into a number, string, or false.
	 */

	function normalizePort(val) {
	  var port = parseInt(val, 10);

	  if (isNaN(port)) {
	    // named pipe
	    return val;
	  }

	  if (port >= 0) {
	    // port number
	    return port;
	  }

	  return false;
	}

	/**
	 * Event listener for HTTP server "error" event.
	 */

	function onError(error) {
	  if (error.syscall !== 'listen') {
	    throw error;
	  }

	  var bind = typeof port === 'string'
	    ? 'Pipe ' + port
	    : 'Port ' + port

	  // handle specific listen errors with friendly messages
	  switch (error.code) {
	    case 'EACCES':
	      console.error(bind + ' requires elevated privileges');
	      process.exit(1);
	      break;
	    case 'EADDRINUSE':
	      console.error(bind + ' is already in use');
	      process.exit(1);
	      break;
	    default:
	      throw error;
	  }
	}

	/**
	 * Event listener for HTTP server "listening" event.
	 */

	function onListening() {
	  var addr = server.address();
	  var bind = typeof addr === 'string'
	    ? 'pipe ' + addr
	    : 'port ' + addr.port;
	  debug('Listening on ' + bind);
	  console.log('Project SolidMonkey started\nListening on port ' + port)
	}
	
});

var ensureAuthenticated = function(req, res, next) {
 	if (req.isAuthenticated()){
 		return next();
 	}

 	else{
 		res.redirect('/');
 	}
 }

	//function that allows sub apps to be added to this app dynamically (when the server is running)
	function importAppt(appName) {
		// add the route
		
		app.use('/user/' + appName, ensureAuthenticated, 
				clientHelpers.getUsersDevice,
				require('./apps/' + appName + '/app'),  
				function(req, res, next) {
					return next();
				}
		);

		// put the new route before the 404 catch on the router stack
		// this assumes there are 3 other routes after this one (len - 3)
		var last = app._router.stack[app._router.stack.length - 1];
		var index = app._router.stack.length - 1;
		
		// delete
		if (index > -1) {
			app._router.stack.splice(index, 1);
		} else {
			throw new Error(appName + ' does not exist');
		}
		
		// add back in to the correct spot
		app._router.stack.splice(app._router.stack.length - 3, 0, last);
	}

	// function that removes sub apps dynamically
	function removeApp(appName) {
		// search and destroy
		var found = false;
		for (var i = 0; i < app._router.stack.length && !found; i++) {
			var tempIndex = app._router.stack[i].regexp.toString().indexOf(appName);
			var tempAppName = app._router.stack[i].regexp.toString();
			
			// problem is with appName.length
			var t = tempAppName.substring(tempIndex, appName.length + tempIndex);
			
			if (tempIndex > -1 && t === appName) {
				app._router.stack.splice(i, 1);
				found = true;
			} else if (i === app._router.stack.length - 1 ) {
				throw new Error(appName + ' does not exist');
			}
		}
	}
	

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}


function initializeApps() {
	var appDirs = getDirectories(__dirname + '/apps');
	for (var i = 0; i < appDirs.length; i++) {
		appList[i] = appDirs[i];
		admin.importApp(appDirs[i], function(){});
	}
}

function initializeRDTS() {
	var rdtDirs = getDirectories(__dirname + '/rdts');
	for (var i = 0; i < rdtDirs.length; i++) {
		rdtList[i] = rdtDirs[i];
		admin.importRDT(rdtDirs[i]);
	}
}

	exports.importAppt = importAppt;
	exports.removeApp = removeApp;
