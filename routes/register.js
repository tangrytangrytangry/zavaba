const express = require('express');
const passport = require('passport');
const Account = require('../db/models/user');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('../views/register', {});
});

router.post('/', (req, res, next) => {
  Account.register(new Account({ username: req.body.username, role: "Some role" }), req.body.password, (err, account) => {
    if (err) {
      return res.render('../views/register', { user: req.user, error: err.message });
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
