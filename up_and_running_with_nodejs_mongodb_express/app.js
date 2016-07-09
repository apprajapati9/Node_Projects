var express = require('express');
//Express - require - express.. require function says - it has to be there .. 

var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// New Code
//Connecting mongoDb to Node.js
//Monk act as layer/ medium between nodejs and mongodb to connect eachother
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest2');

var routes = require('./routes/index');
var users = require('./routes/users');

//it creates an express application. the express function is a top level function exported by the express module.
var app = express();


// view engine setup
//This indicates where to look for web pages file.. 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//app.use - mounts the specified middleware function or functions at the specified path, if not , default is / 
app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//set the static path of public where you can put all of your images/css/js files for web page
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
//db is instance of mongodb database app connected using monk 
// here making it available for the router 
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

module.exports = app;