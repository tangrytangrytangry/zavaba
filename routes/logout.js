var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/home');
  });
});

module.exports = router;
