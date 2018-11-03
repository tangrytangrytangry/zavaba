const express = require('express');
const passport = require('passport');
const Account = require('../db/models/user');
const router = express.Router();
var debug = require('debug')('server:signup');

router.get('/', (req, res) => {

  var errors = req.flash('error');

  var signupRenderParms = {
    user: req.user,
    "main": req.currentLangData.html.page.main,
    "signup": req.currentLangData.html.page.signup
  };

  // If were errors, then add them to screen (flash)
  if (errors.length > 0) {
    signupRenderParms.error = errors;
  };

  res.render('../views/signup', signupRenderParms);

});

router.post('/', (req, res, next) => {
  Account.register(
    new Account(
      {
        username: req.body.username,
        role: "standard",
        created: new Date(),
        admin: false,
        active: true,
        personalData: {
          name: req.body.name,
          email: req.body.email,
          location: req.body.country
        }

      }),

    req.body.password,
    (err, account) => {
      if (err) {
        return res.render('../views/signup', { user: req.user, error: err.message });
      }
      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/home');
        });

      });
    });
});

module.exports = router;
