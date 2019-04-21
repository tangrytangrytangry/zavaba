const Activity = require('../db/models/activity');
const Description = require('../db/models/description');

module.exports = {

	periodList: function (req, res, cb) {

		//var documentCount = 0;

		//Activity.countDocuments({ date: searchDate }, function (err, docCount) {
		//Activity.countDocuments( function (err, docCount) {
		//	if (err) return handleError(err);
		//	documentCount = docCount;

		//	cb(documentCount);
		//	console.log("server reports.js: documentCount = " + documentCount);
		//	return "server reports.js: documentCount = " + documentCount;

		//});

		// Use the aggregation pipeline builder
		Activity.aggregate().
			// group({ _id: "$date", count: { $sum: 1 } }).
			group({
				_id: {
					"year": "$data.year",
					"month": "$data.month"
				}, count: { $sum: 1 }
			}).
			exec(function (err, res) {
				if (err) return handleError(err);
				resStr = JSON.stringify(res);
				cb(resStr);
				//console.log("server reports.js/periodlist: resStr = " + resStr);
				return resStr;
			});

		return null;

	},

	eventList: function (req, res, cb) {

		var currentDate = new Date();
		var currentDateNumber8 = 0;
		var date6MonthsAgo;
		var date6MonthsAgoNumber8 = 0;

		var deepListMonths = parseInt(req.query.deepListMonths); 

		currentDateNumber8 = currentDate.getFullYear() * 10000 +
			(currentDate.getMonth() + 1) * 100 +
			currentDate.getDate();

		date6MonthsAgo = currentDate;
		date6MonthsAgo.setMonth(date6MonthsAgo.getMonth() - deepListMonths);
		date6MonthsAgoNumber8 = date6MonthsAgo.getFullYear() * 10000 +
			(date6MonthsAgo.getMonth() + 1) * 100 +
			date6MonthsAgo.getDate();
		//console.log("server reports.js/eventList: date6MonthsAgoNumber8 = " + date6MonthsAgoNumber8);
		
		/*
				Activity.find({ date: { $gte: date6MonthsAgoNumber8 }, active: "Y" }, 'date item', function (err, datesList) {
					cb(JSON.stringify(datesList));
					//console.log("server reports.js/eventList: datesList = " + datesList);
					return JSON.stringify(datesList);
		
				});
		return;
		*/

		// Using the promise returned from executing a query
		var queryDates = Activity.find({ date: { $gte: date6MonthsAgoNumber8 }, active: "Y" }, 'date item');
		var promiseDates = queryDates.exec();
		promiseDates.then(function (datesList) {
			cb(JSON.stringify(datesList));
			//console.log("server reports.js/eventList: datesList = " + datesList);
			return JSON.stringify(datesList);

		});
		return;

		// Use the aggregation pipeline builder
		Activity.aggregate().
			// group({ _id: "$date", count: { $sum: 1 } }).
			group({
				_id: {
					"year": "$data.year",
					"month": "$data.month"
				}, count: { $sum: 1 }
			}).
			exec(function (err, res) {
				if (err) return handleError(err);
				resStr = JSON.stringify(res);
				cb(resStr);
				//console.log("server reports.js/periodlist: resStr = " + resStr);
				return resStr;
			});

		return null;

	},

	checkGuestCounts: function (req, res, next) {
		var cart = req.session.cart;
		if (!cart) return next();
		if (cart.items.some(function (item) { return item.guests > item.product.maximumGuests; })) {
			if (!cart.errors) cart.errors = [];
			cart.errors.push('One or more of your selected tours cannot accommodate the ' +
				'number of guests you have selected.');
		}
		next();
	}
};
