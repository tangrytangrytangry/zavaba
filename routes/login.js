var express = require('express');
const passport = require('passport');
var debug = require('debug')('server:login');
const User = require('../db/models/user');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {

  //var errors = req.flash();
  var errors = req.flash('error');

  if (errors.length > 0) {
    res.render('../views/login',
      {
        welcome: 'Welcome to Express from login',
        user: req.user,
        error: errors,
        "main": req.currentLangData.html.page.main
      });

  } else {
    res.render('../views/login',
      {
        welcome: 'Welcome to Express from login',
        user: req.user,
        "main": req.currentLangData.html.page.main
      });
  }
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
