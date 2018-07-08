var express = require('express');
const passport = require('passport');
var debug = require('debug')('server:index');
const User = require('../db/models/user');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
  res.render('../views/login', { welcome: 'Welcome to Express' });
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
      res.redirect('/');
    });
  });



module.exports = router;
