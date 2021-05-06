//fra Example A.270. Setup file app.js

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* part I from Traversy video */
const flash = require('connect-flash'); // Bruges til at vise beskeder til brugeren på siden via req flash
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

//const db = require('./config/keys').mongoURI;
mongoose.connect('mongodb://localhost/some', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then( function() { console.log('mongoose connection open'); })
    .catch( function(err) { console.error(err); });
/* end Traversy */


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.locals.pretty = app.get('env') === 'development';       // pretty print html

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* part II from Traversy Video */
app.use(session(                        // setup session
    {
        secret: '998537qporhgpfangæ143+575?)(%lfjgaæ',  // footprints of the keyboard cat
        resave: true,
        saveUninitialized: true
    }));

// Passport middleware
app.use(passport.initialize());         // init passport
app.use(passport.session());            // connect passport and sessions
require('./config/passport')(passport);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
/* end Traversy */

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;