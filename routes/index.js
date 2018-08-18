var express = require('express');
var router = express.Router();
var debug = require('debug')('server:index');

/* GET home page */
router.get('/', function (req, res, next) {
  res.render('../views/home',
    {
      user: req.user,
      "main": req.currentLangData.html.page.main
    },
    /*function (err, html) {
      res.send(html);
      return;
    }*/
  );
});

module.exports = router;
