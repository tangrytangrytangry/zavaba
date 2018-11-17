var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var debug = require('debug')('server:users');

const Activity = require('../db/models/activity');

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

  //res.sendFile(path.join(__dirname, 'views/index.html'));
  // /public/images/Zabava_08.png

  //var itemNumber = crtNewActivity(req.user.username, curDate, pictName, pictBody, attachName, attachBody);
  Activity.crtNewActivity(req.user.username, curDate, pictName, pictBody, attachName, attachBody);

  /*
  let newItem = findMaxItem();
  newItem = newItem + 1;

  var newActivity = new Activity(
    {
      date: curDate,
      item: newItem,
      data: {
        kind: "ordinary"
      }
    });
  // console.log(newActivity);

  newActivity.save(function (err, newActivity) {
    if (err) return console.error(err);
  });
*/

  res.send('newActivity created   ' + new Date());

});

function crtNewActivity(user, date, pict_Name, pict_Body, attach_Name, attach_Body) {

  let searchDate = 0;
  let newItem = 0;

  if (date) {
    searchDate = date;
  } else {
    let today = new Date();
    searchDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  }

  Activity.countDocuments({ date: searchDate }, function (err, docCount) {
    if (err) return handleError(err);
    docCount = docCount + 1;
    newItem = docCount;
    savNewActivity(searchDate, docCount);
    // console.log('docCount = ' + docCount);
  });

  // New item number for the date
  // let promiseCount = Activity.countDocuments({ date: searchDate }).exec();
  // promiseCount.then(function (docCount) { savNewActivity(docCount); })

  function savNewActivity(itemDate, docCount) {

    let itemYear = Math.trunc(itemDate / 10000);
    let itemMonth = Math.trunc((itemDate - itemYear * 10000) / 100);
    let itemDay = Math.trunc(itemDate - (itemYear * 10000 + itemMonth * 100));

    var newActivity = new Activity(
      {
        date: itemDate,
        item: newItem,
        data: {
          year: itemYear,
          month: itemMonth,
          day: itemDay,
          kind: "ordinary",
          picture: {
            name: pict_Name,
            body: pict_Body
          },
          attachment: {
            name: attach_Name,
            body: attach_Body
          }
        },
        log: {
          usernamecrt: user
        }
      });

    console.log('1 newActivity.meow() = ' + newActivity.meow());

    newActivity.save(function (err, newActivity) {
      if (err) return console.error(err);
    });

    console.log('2 newActivity.meow() = ' + newActivity.meow());

    //console.log('newActivity = ' + newActivity);

  }; // savNewActivity

} // crtNewActivity

function findMaxItem(date) {

  let searchDate = 0;
  let maxItem = 0;

  if (date) {
    searchDate = date;
  } else {
    let today = new Date();
    searchDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  }

  /*
  const query = Activity.find(); // `query` is an instance of `Query`
  query.setOptions({ item: 1 });
  query.collection(Activity.collection);
  query.where('item').eq(1).exec(function (err, activities) {
    console.log(activities);
    if (err) return handleError(err);
    for (let index = 0; index < activities.length; index++) {
      if (activities[index]['item'] > maxItem) { maxItem = activities[index]['item']; }
    }
  });
  */

  let promiseCount = Activity.countDocuments({ date: searchDate }).exec();

  async function cbCount(x) {
    console.log(x + ' in cbCount() Start');
    try {
      var maxItem = await promiseCount;
    } catch (errCount) {
      console.log('Error from Activity.countDocuments(): ' + errCount);
    }
    console.log(x + ' in cbCount() maxItem = ' + maxItem);
  }

  console.log('out cbCount() = ' + cbCount(1));
  console.log('out cbCount() = ' + cbCount(2));

  function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }

  async function asyncCall(x) {
    console.log(x + ' asyncCall() Start ');
    var result = await resolveAfter2Seconds();
    console.log(x + ' asyncCall() result = ' + result);
  }

  asyncCall(1);
  asyncCall(2);

  return maxItem;

}

module.exports = router;
