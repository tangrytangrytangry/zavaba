var express = require('express');
var router = express.Router();
var debug = require('debug')('server:users');

const Activity = require('../db/models/activity');


/* GET users listing. */
router.get('/', function (req, res, next) {

  var today = new Date();
  var curDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

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

  res.send('newActivity = ' + newActivity);
});


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

  let promiseCount = Activity.countDocuments({ date: searchDate }).exec();;

  maxItem = cbCount();

  async function cbCount() {
  //  if (err) return handleError(err);
    const dateCount = await promiseCount;
    return dateCount;
  }

  return maxItem;

}


module.exports = router;
