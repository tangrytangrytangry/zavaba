var express = require('express');
var router = express.Router();
var debug = require('debug')('server:index');

/* GET home page */
router.get('/', function (req, res, next) {
  res.render('../views/home',
    {
      user: req.user,
      "main": req.currentLangData.html.page.main,
      "home": req.currentLangData.html.page.home
    },
    /*function (err, html) {
      res.send(html);
      return;
    }*/
  );
});

module.exports = router;
