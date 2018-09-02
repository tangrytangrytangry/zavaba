var express = require('express');
const passport = require('passport');
var debug = require('debug')('server:login');
const User = require('../db/models/user');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {

  var errors = req.flash('error');

  var loginRenderParms = {
    welcome: 'Welcome to Express from login',
    user: req.user,
    "main": req.currentLangData.html.page.main,
    "login": req.currentLangData.html.page.login
  };

  // If were errors, then add them to screen (flash)
  if (errors.length > 0) {
    loginRenderParms.error = errors;
  };

  res.render('../views/login', loginRenderParms );

});

/* POST login page. */
//router.post('/', function (req, res, next) {
//  res.render('../views/home', { welcome: 'Welcome to Express' });
//});

router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/home');
    });
  });

module.exports = router;
