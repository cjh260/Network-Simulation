var express = require('express');
var path = require('path');

/** 
 * Specifying this stuff is optional as it is already defined in the parent app.js
 */
/*
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
*/

var index = require('./routes');

var counterApp = express();

//view engine setup
counterApp.set('views', path.join(__dirname, 'views'));
counterApp.set('view engine', 'hjs');

/** 
 * Specifying this stuff is optional as it is already defined in the parent app.js
 */
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
/*
counterApp.use(logger('dev'));
counterApp.use(bodyParser.json());
counterApp.use(bodyParser.urlencoded({ extended: false }));
counterApp.use(cookieParser());
*/

counterApp.use(express.static(path.join(__dirname, 'public')));

counterApp.use('/', index);


// catch 404 and forward to error handler
counterApp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (counterApp.get('env') === 'development') {
    counterApp.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
counterApp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// important
module.exports = counterApp;