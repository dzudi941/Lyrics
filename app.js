var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var addsongs = require('./routes/addSong.js'); 
var pass = require('./routes/passportimpl.js'); 
var admin = require('./routes/admin.js'); 
var showsongs = require('./routes/showSong.js'); 
var showartist = require('./routes/showArtist.js'); 

var passport = require('passport');
var session = require('express-session');

var app = express();
/*var app1 = require('express')();
var server = require('http').Server(app1);
var io = require('socket.io')(server);
server.listen(80);*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); ////false vraca test[test1] //true vraca test { test1: } //jako bitno
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "dzudi",
    name: 'dzudi',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/', addsongs);
app.use('/', pass);
app.use('/admin', admin);
app.use('/showSong', showsongs);
app.use('/showArtist', showartist);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
