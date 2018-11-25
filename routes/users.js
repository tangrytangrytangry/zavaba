var fs = require('fs');
var path = require('path');
var express = require('express');
var async = require("async");

var router = express.Router();
var debug = require('debug')('server:users');

const Activity = require('../db/models/activity');
const Description = require('../db/models/description');

/* GET users listing. */
router.get('/', function (req, res, next) {

  var today = new Date();
  var curDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  var pictPath = path.join(__dirname, '../public/images');
  var pictName = path.join(pictPath, 'Zabava_08_3D_Yellow.png');
  var pictBody = fs.readFileSync(pictName);

  var attachPath = path.join(__dirname, '../public/images');
  var attachName = path.join(attachPath, 'Zabava_08.png');
  var attachBody = fs.readFileSync(attachName);

  Activity.crtNewActivity(req.user.username, curDate, pictName, pictBody, attachName, attachBody);
  
  Description.crtNewDescription(req.user.username, curDate, undefined, 'RU', 'Русское описание');
  Description.crtNewDescription(req.user.username, curDate, undefined, 'ES', 'Español descripción');
  Description.crtNewDescription(req.user.username, curDate, undefined, 'EN', 'English description');

  //const query1 = MyModel.find({ name: /john/i }, null, { skip: 10 });
  //const result1 = await query1.exec();

  /*
    async function f1() {
      const query1 = Activity.countDocuments({ date: curDate }, function (err, docCount) {
        console.log('docCount = ' + docCount);
        return docCount;
      });
      const result1 = await query1.exec();
      console.log('result1 = ' + result1);
    }
    // console.log('f1() = ' + f1());
  
    async.series([
      //  Activity.countDocuments({ date: curDate }, function (err, docCount) {
      //    console.log('docCount = ' + docCount);
      //    return docCount;
      //  })
      f1
    ]);
    console.log('async.series');
  */
  /*
  Предлагаю сделать так:
  var flag=false;
  function wait(){
  if(!flag) setTimeout('wait()',100);
  else return;
  }
  wait();
  Этот вариант будет ждать, пока flag не будет установлен другим процессом 
  */

  /*
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function demo(idx) {
    console.log(idx + ' ' + 'Taking a break... ' + new Date());
    await sleep(1000);
  }
  for (let index = 0; index < 10; index++) {
    demo(index);
  }
  */

  res.send('newActivity created   ' + new Date());

});

module.exports = router;
