var express = require('express');
var router = express.Router();
var debug = require('debug')('server:users');

const Activity = require('../db/models/activity');


/* GET users listing. */
router.get('/', function (req, res, next) {

  var today = new Date();
  var curDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  function findMaxItem(date) {

    let searchDate = 0;
    let maxItem = 0;

    if (date) {
      searchDate = date;
    } else {
      let today = new Date();
      searchDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    }

    Activity.find({ date: searchDate }, 'item', function (err, activity) {
      if (err) return handleError(err);
      for (let index = 0; index < activity.length; index++) {
        if (activity[index]['item'] > maxItem) { maxItem = activity[index]['item'] ; }
      }
    })

    return maxItem;

  }

  let newItem = findMaxItem() + 1;

  var newActivity = new Activity(
    {
      date: curDate,
      item: newItem,
      data: {
        kind: "ordinary"
      }
    });
  console.log(newActivity);

  newActivity.save(function (err, newActivity) {
    if (err) return console.error(err);
  });


  res.send('newActivity = ' + newActivity);
});

module.exports = router;
