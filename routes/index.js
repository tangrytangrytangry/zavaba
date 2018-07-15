var express = require('express');
var router = express.Router();
var debug = require('debug')('server:index');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('../views/home', { user: req.user, main_currentLang : req.currentLang });

});

module.exports = router;
