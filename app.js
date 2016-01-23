var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    cors = require('cors');
    //validator = require('express-validator');

/**
 * Database connection
 */
var mongoose = require('mongoose'),
    uriString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/schoolmx';

mongoose.connect(uriString);
var db = mongoose.connection;

var routes = require('./routes/index'),
    auth = require('./routes/auth'),
    users = require('./routes/users');

var app = express();

db.on('error', console.error.bind(console, 'Connection Error.'));
db.once('open', function() {
  console.log('connected ........................');

  app.use(function (request, response, next) {
    request.db = db;
    next();
  });
});

/**
 * App information.
 */
app.locals.title = 'SchoolMx';
app.locals.version = '0.0.1';
app.locals.email = 'schoolmx@bitrient.com';
app.locals.address = {
  lineOne: 'Bitrient Services, Jos 930281',
  lineTwo: 'Plateau State, Nigeria.'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/auth', auth);
app.use('*', routes);

// catch 404 and forward to error handler
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


module.exports = app;
