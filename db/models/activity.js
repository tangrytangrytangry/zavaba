var mongoose = require('mongoose');

const Description = require('./description');

var activitySchema = mongoose.Schema({
    date: { type: Number, required: true },
    item: { type: Number, required: true },
    active: String,
    data: {
        year: Number,
        month: Number,
        day: Number,
        kind: { type: String, required: true },
        picture: {
            name: String,
            body: Buffer
        },
        attachment: {
            name: String,
            body: Buffer
        }
    },
    log: {
        created: { type: Date, default: Date.now },
        usernamecrt: String,
        updated: Date,
        usernameupd: String
    }
});

activitySchema.static('crtNewActivity',
    function (user, date = undefined,
        kind = "ordinary", pict_Name, pict_Body, attach_Name, attach_Body, ...restArgs) {

        let searchDate = 0;
        let newItem = 0;

        if (date) {
            searchDate = date;
        }

        if (searchDate <= 0) {
            let today = new Date();
            searchDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        }

        Activity.countDocuments({ date: searchDate }, function (err, docCount) {
            if (err) return handleError(err);
            docCount = docCount + 1;
            newItem = docCount;
            savNewActivity(searchDate, docCount, kind);

            if (restArgs.length > 0) {
                for (let index = 0; index < restArgs[0].length; index++) {
                    Description.crtNewDescription(user, date, newItem,
                        restArgs[0][index].langcode,
                        restArgs[0][index].text);
                }
            }
        });

        // New item number for the date
        // let promiseCount = Activity.countDocuments({ date: searchDate }).exec();
        // promiseCount.then(function (docCount) { savNewActivity(docCount); })

        function savNewActivity(itemDate, docCount, itemKind) {

            let itemYear = Math.trunc(itemDate / 10000);
            let itemMonth = Math.trunc((itemDate - itemYear * 10000) / 100);
            let itemDay = Math.trunc(itemDate - (itemYear * 10000 + itemMonth * 100));

            var newActivity = new Activity(
                {
                    date: itemDate,
                    item: newItem,
                    active: "Y",
                    data: {
                        year: itemYear,
                        month: itemMonth,
                        day: itemDay,
                        kind: itemKind,
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

            newActivity.save(function (err, newActivity) {
                if (err) return console.error(err);
            });

        }; // savNewActivity()

    } // crtNewActivity()

); // activitySchema.static('crtNewActivity') 

activitySchema.static('updActivity',
    function (user, date = undefined, item = undefined,
        kind = "ordinary", pict_Name, pict_Body, attach_Name, attach_Body, ...restArgs) {

        let searchDate = 0;
        let updItem = 0;

        if (date) {
            searchDate = date;
        }

        if (searchDate <= 0) {
            let today = new Date();
            searchDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        }

        if (item) {
            updItem = item;
        }

        if (updItem <= 0) {

            Activity.countDocuments({ date: searchDate }, function (err, docCount) {
                if (err) return handleError(err);
                updItem = docCount;

                Activity.findOne({ date: searchDate, item: updItem, active: "Y" }, function (err, thisActivity) {
                    if (err) return handleError(err);
                    savActivity(thisActivity);
                });

            });

        } else {
            Activity.findOne({ date: searchDate, item: updItem, active: "Y" }, function (err, thisActivity) {
                if (err) return handleError(err);
                savActivity(thisActivity);
            });
        }

        // New item number for the date
        // let promiseCount = Activity.countDocuments({ date: searchDate }).exec();
        // promiseCount.then(function (docCount) { savNewActivity(docCount); })

        function savActivity(parActivity) {

            //console.log("savActivity: parActivity = " + parActivity);

            parActivity.data.kind = kind;
            parActivity.log.updated = new Date();
            parActivity.log.usernameupd = user;

            parActivity.save(function (err, parActivity) {
                if (err) return console.error(err);
            });

        }; // savActivity()

    } // updActivity()

); // activitySchema.static('updActivity') 


var Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;

