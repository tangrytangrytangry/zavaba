var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var debug = require('debug')('server:app');
var nunjucks = require('nunjucks');
var crypto = require('crypto');
var helmet = require('helmet');
var flash = require('connect-flash');
var reports = require('./lib/reports.js');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var mongoConnectionOptions = {};
mongoose.Promise = global.Promise;

var credentials = require('./credentials/credentials.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var registerRouter = require('./routes/register');
var logoutRouter = require('./routes/logout');

var i18n = require("i18n");
var i18Ext = require("./config/config-i18n");

var winston = require('winston');
var winstonExt = require("./config/config-winston");

var app = express();

// Configure i18n
i18Ext.configure(app, i18n);

// Configure Winston logging
var logger = winstonExt.configure(app, winston);

// If app language was changed then change app language
app.use('/language', function (req, res) {

    let data = "";

    //let reqLang = decodeURIComponent(req.params.lang);
    let reqLang = decodeURIComponent(req.query.lang);

    let appCurrentLang = app.get('currentLang');

    if (appCurrentLang !== reqLang) {

        let pos = app.locals.i18n.locales.indexOf(reqLang);

        if (pos >= 0) {
            app.set('currentLang', reqLang);
            app.set('currentLangData', i18n.getCatalog(reqLang));
        };
    };

    res.end(data);
    return;
});

// If app language was changed then change req language
app.use('/', function (req, res, next) {
    let appCurrentLang = app.get('currentLang');
    let reqCurrentLang = req.getLocale();

    if (!appCurrentLang) {
        app.use(i18n.init);
        app.set('currentLang', i18n.getLocale());
        app.set('currentLangData', i18n.getCatalog(i18n.getLocale()));
    };

    if (appCurrentLang !== reqCurrentLang) {
        req.setLocale(appCurrentLang);
        req.currentLang = appCurrentLang;
    }
    req.currentLangData = i18n.getCatalog(appCurrentLang);

    next();
});

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

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
var User = require('./db/models/user');
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false,
    session: true
},
    /*
    function (req, username, password, cb) {
        db.users.findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }
    */

    // #### authenticate(password, [cb])
    // Authenticate a user object. If no callback `cb` is provided a `Promise` is returned.
    // ### Callback Arguments

    // * err
    //   * null unless the hasing algorithm throws an error
    // * thisModel
    //   * the model getting authenticated *if* authentication was successful otherwise false
    // * passwordErr
    //   * an instance of `AuthenticationError` describing the reason the password failed, else undefined.

    // User.authenticate(function name(err, thisModel, passwordErr) { return; })
    User.authenticate()
    // User.createStrategy()
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
/*
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
*/
passport.serializeUser(User.serializeUser());

/*
passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
*/
passport.deserializeUser(User.deserializeUser());

// The flash is a special area of the session used for storing messages. 
// Messages are written to the flash and cleared after being displayed to the user. 
app.use(flash());

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

// Build mongo database connection url //
process.env.DB_HOST = process.env.DB_HOST || credentials.mongo.development.host;
process.env.DB_PORT = process.env.DB_PORT || credentials.mongo.development.port;
process.env.DB_NAME = process.env.DB_NAME || credentials.mongo.development.name;
process.env.DB_USER = process.env.DB_USER || credentials.mongo.development.user;
process.env.DB_PASS = process.env.DB_PASS || credentials.mongo.development.pass;

if (app.get('env') === 'production') {
    process.env.DB_URL = credentials.mongo.production.connectionString;
} else {
    process.env.DB_URL = credentials.mongo.development.connectionString;
}

var mongoConnectionOptions = {
    url: process.env.DB_URL,
    ttl: 0.5 * 24 * 60 * 60, // = 1/2 days. Session cookie expiration date
    autoRemove: 'interval', // removing expired sessions
    autoRemoveInterval: 10, // In minutes. Default
    touchAfter: 24 * 3600 // time period in seconds to lazy update the session
};

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const mongoConnection = new MongoStore(mongoConnectionOptions);

app.use(session({
    secret: credentials.sessionSecret,
    proxy: true,
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: { secure: false },
    store: mongoConnection
})
);

// Initialize Passport and restore authentication state, if any, from the
// session. To use Passport in an Express or Connect-based application, configure 
// it with the required passport.initialize() middleware. 
// If your application uses persistent login sessions (recommended, but not required), 
// passport.session() middleware must also be used.
app.use(passport.initialize());
app.use(passport.session());

// Use the session middleware
// Access the session as req.session
/*
app.get('/', function (req, res, next) {
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
*/

// 5.4. Контроль доступа
// Express предоставляет элегатный способ по ограничению доступа для 
// залогиненных пользователей. При определения HTTP-обработчика может быть 
// задан необязательный параметр маршрутизации:

function loadUser(req, res, next) {
    if (req.session.user_id) {
        User.findById(req.session.user_id, function (user) {
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

//app.get('/documents.:format?', loadUser, function (req, res) {
// ...
//});

// Теперь доступ к адресу (URL), требующему только авторизованных пользователей, 
// может быть ограничен простым добавлением loadUser в соответствующий HTTP-обработчик. 
// Вспомогательная функция принимает те же параметры, что и обычный обработчик, плюс один 
// дополнительный параметр next. Последний позволяет использовать дополнительную логику 
// перед непосредственным вызовом функции обработчика адреса. В нашем проекте, 
// пользователь загружается, используя сессионую переменную user_id. 
// Если пользователь не найден, то функция next не вызывается и происход 
// переадресация на окно ввода логина/пароля.

app.use(favicon(path.join(__dirname, '/public/images/Zabava_08.png')));
app.use('/', function (req, res, next) {
    logger.log({
        level: 'info',
        message: req.url
    });
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function (req, res, next) {
    req.currentLang = app.get('currentLang');
    next();
},
    indexRouter);

app.use('/home', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

// Get report data from database
app.get('/reports', function (req, res) {

    let reportCode = req.query.report;
    let data = "";

    switch (reportCode) {

        case "periodlist":

            data = reports.periodList(req, res, function name(repData) {
                //console.log("server app.js/reports/periodlist: repData = " + repData);
                res.end(repData);
                return;

            });
            break;

        case "eventlist":

            data = reports.eventList(req, res, function name(repData) {
                //console.log("server app.js/reports/eventlist: repData = " + repData);
                res.end(repData);
                return;

            });
            break;

            case "oneevent":

            data = reports.oneEvent(req, res, function name(repData) {
                //console.log("server app.js/reports/oneevent: repData = " + repData);
                res.end(repData);
                return;

            });
            break;

            case "oneeventdesc":

            data = reports.oneEventDesc(req, res, function name(repData) {
                //console.log("server app.js/reports/oneeventdesc: repData = " + repData);
                res.end(repData);
                return;

            });
            break;

        default:
            break;
    }

    return;

});

// Get user info
app.get('/getUserInfo', function (req, res) {
    res.end(JSON.stringify(req.user)); 
});

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
    res.send('500 - Server Error \n' +
        err.message);
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
