var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('server:app');
var nunjucks = require('nunjucks');
var crypto = require('crypto');
var helmet = require('helmet');
var credentials = require('./credentials/credentials.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Install nunjucks as the rendering engine for the express app
var envNunjucks = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    cache: false,
    watch: true
});

// Set Nunjucks as rendering engine for pages with .njk suffix
//app.engine( 'njk', nunjucks.render ) ;
//app.set( 'view engine', 'njk' ) ;
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

// Helmet can help protect your app from some well-known 
// web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// custom 404 page
app.use(function (req, res, next) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
    // res.status(500).send('Something broke!');
});

/*
app.use(function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '404.html'));
  })
  
  app.use(function (err, req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '500.html'));
  })
  
*/

module.exports = app;
