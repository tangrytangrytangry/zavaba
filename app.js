var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('server:app');
var nunjucks = require('nunjucks');
var crypto = require('crypto');
var helmet = require('helmet');
var MongoStore = require('connect-mongo')(session);

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

// Parse Cookie header and populate req.cookies with 
// an object keyed by the cookie names.
// app.use(cookieParser(credentials.cookieSecret))
/*
app.get('/', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)
    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
  })
*/

// build mongo database connection url //

process.env.DB_HOST = process.env.DB_HOST || credentials.mongo.development.host;
process.env.DB_PORT = process.env.DB_PORT || credentials.mongo.development.port;
process.env.DB_NAME = process.env.DB_NAME || credentials.mongo.development.name;
process.env.DB_NAME = process.env.DB_USER || credentials.mongo.development.user;
process.env.DB_NAME = process.env.DB_PASS || credentials.mongo.development.pass;

if (app.get('env') === 'production') {
    process.env.DB_URL = credentials.mongo.development.connectionString;
} else {
    process.env.DB_URL = credentials.mongo.production.connectionString;
}

app.use(session({
    secret: credentials.sessionSecret,
    proxy: true,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MongoStore({ url: process.env.DB_URL })
})
);

// Use the session middleware
// Access the session as req.session
app.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})


// 5.4. Контроль доступа
// Express предоставляет элегатный способ по ограничению доступа для 
// залогиненных пользователей. При определения HTTP-обработчика может быть 
// задан необязательный параметр маршрутизации:

function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/sessions/new');
      }
    });
  } else {
    res.redirect('/sessions/new');
  }
}

app.get('/documents.:format?', loadUser, function(req, res) {
  // ...
});

// Теперь доступ к адресу (URL), требующему только авторизованных пользователей, 
// может быть ограничен простым добавлением loadUser в соответствующий HTTP-обработчик. 
// Вспомогательная функция принимает те же параметры, что и обычный обработчик, плюс один 
// дополнительный параметр next. Последний позволяет использовать дополнительную логику 
// перед непосредственным вызовом функции обработчика адреса. В нашем проекте, 
// пользователь загружается, используя сессионую переменную user_id. 
// Если пользователь не найден, то функция next не вызывается и происход 
// переадресация на окно ввода логина/пароля.


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
