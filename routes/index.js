var express = require('express');
var router = express.Router();
var debug = require('debug')('server:index');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('../views/home', { user: req.user, main_currentLang : req.currentLang });
  let main_currentLang = {};
  main_currentLang.zz = 'Some';
  res.render('../views/home', { user: req.user, main_currentLang: main_currentLang });

});

module.exports = router;
