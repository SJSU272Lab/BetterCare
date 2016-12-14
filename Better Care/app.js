var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
    response.render('index');
});

app.get('/1', function(request, response){
    response.render('index7');
});

app.get('/2', function(request, response){
    response.render('index8');
});

app.get('/3', function(request, response){
    response.render('index9');
});

app.get('/4', function(request, response){
    response.render('index10');
});

app.get('/5', function(request, response){
    response.render('index11');
});

app.get('/compare', function(request, response){
    response.render('compare');
});

app.get('/explore', function(request, response){
    response.render('explore');
});

app.get('/how', function(request, response){
    response.render('how');
});

app.get('/trends', function(request, response){
    response.render('trends');
});

app.use('/users', users);



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
