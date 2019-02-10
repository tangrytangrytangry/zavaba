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
