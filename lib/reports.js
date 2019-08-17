const Activity = require('../db/models/activity');
const Description = require('../db/models/description');

module.exports = {

	periodList: function (req, res, cbPeriods) {

		// Use the aggregation pipeline builder
		Activity.aggregate().
			// group({ _id: "$date", count: { $sum: 1 } }).
			group({
				_id: {
					"year": "$data.year",
					"month": "$data.month"
				}, count: { $sum: 1 }
			}).
			sort({
				"_id.year": 'descending',
				"_id.month": 'descending'
			}).
			exec(function (err, res) {
				if (err) return handleError(err);
				resPeriodList = JSON.stringify(res);
				cbPeriods(resPeriodList);
				//console.log("server reports.js/periodlist: resPeriodList = " + resPeriodList);
				return resPeriodList;
			});

		return null;

	},

	eventList: function (req, res, cbEvents) {

		var currentDate = new Date();
		var currentDateNumber8 = 0;
		var date6MonthsAgo;
		var date6MonthsAgoNumber8 = 0;

		var deepListMonths = parseInt(req.query.deepListMonths);
		var filterObject = JSON.parse(req.query.filterObject);

		currentDateNumber8 = currentDate.getFullYear() * 10000 +
			(currentDate.getMonth() + 1) * 100 +
			currentDate.getDate();

		date6MonthsAgo = currentDate;
		date6MonthsAgo.setMonth(date6MonthsAgo.getMonth() - deepListMonths);
		date6MonthsAgoNumber8 = date6MonthsAgo.getFullYear() * 10000 +
			(date6MonthsAgo.getMonth() + 1) * 100 +
			date6MonthsAgo.getDate();
		//console.log("server reports.js/eventList: date6MonthsAgoNumber8 = " + date6MonthsAgoNumber8);

		// Using the promise returned from executing a query
		var queryDates = Activity.find({ date: { $gte: date6MonthsAgoNumber8 } },
			'date item active').
			sort({
				"date": 'descending',
				"item": 'descending'
			});
		var promiseDates = queryDates.exec();
		promiseDates.then(function (datesList) {
			//console.log("server reports.js/eventList: datesList = " + datesList);
			filterEvents(datesList, date6MonthsAgoNumber8, filterObject, cbEvents);
			//cbEvents(JSON.stringify(datesList));
			return JSON.stringify(datesList);

		});

		return null;

	},

	oneEvent: function (req, res, cbOneEvent) {

		var eventDate = parseInt(req.query.eventDate);
		var eventNumber = parseInt(req.query.eventNumber);

		Activity.find({ date: { $eq: eventDate }, item: { $eq: eventNumber } },
			'-data.picture.body -data.attachment.body',
			function (err, oneEventDoc) {
				if (err) return handleError(err);

				//console.log("server reports.js/oneEvent: oneEventDoc = " + oneEventDoc);
				cbOneEvent(JSON.stringify(oneEventDoc));
				return JSON.stringify(oneEventDoc);

			});

		return null;

	},

	oneEventDesc: function (req, res, cbOneEventDesc) {

		var eventDate = parseInt(req.query.eventDate);
		var eventNumber = parseInt(req.query.eventNumber);

		Description.find({ date: eventDate, item: eventNumber },
			function (err, eventDescriptions) {
				if (err) return handleError(err);
				//console.log("server reports.js/oneEventDesc: eventDescriptions = " + eventDescriptions);
				cbOneEventDesc(JSON.stringify(eventDescriptions));
				return JSON.stringify(eventDescriptions);

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

function filterEvents(parObjEventList, parFromDateNumber8, parFilterObject, cbEventList) {

	let doFilterEvents = false;
	let eventDate = 0, eventNumber = 0;
	let descDate = 0, descNumber = 0, descText;

	if (parFilterObject) {
		if (parFilterObject.searchtext) {
			if (parFilterObject.searchtext != "") {
				doFilterEvents = true;
			}
		}
	}

	if (doFilterEvents) {

		// Find all event descriptions
		var queryDesc = Description.find({ date: { $gte: parFromDateNumber8 } });
		var promiseDesc = queryDesc.exec();
		promiseDesc.then(function (descList) {
			//console.log("server reports.js/filterEvents: descList = " + descList);

			// descList[0].date = 20180102
			// descList[0].item = 1
			// descList[0].langcode = "EN"
			// descList[0].active = "Y"
			// descList[0].data.text = "English description"

			// Filter all event data comparing search string to event descriptions 
			for (let idx = 0; idx < parObjEventList.length; idx++) {

				eventDate = parObjEventList[idx].date;
				eventNumber = parObjEventList[idx].item;

				// Remove event if it does not meet the selection criteria
				for (let index = 0; index < descList.length; index++) {

					descDate = descList[index].date;
					descNumber = descList[index].item;

					// Compare event description with selection criteria
					if (eventDate == descDate && eventNumber == descNumber) {

						descText = descList[index].data.text;

					}

				}

			}

			cbEventList(JSON.stringify(parObjEventList));

			return null;

		}); // promiseDesc.then()

	} else {

		cbEventList(JSON.stringify(parObjEventList));

	} // if (doFilterEvents)

	return null;

} // filterEvents()
