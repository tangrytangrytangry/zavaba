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

activitySchema.method('meow', function () {
    console.log('meow:   this.date=' + this.date + '   ' + 'this.item=' + this.item);
    return this.item;
})

activitySchema.static('crtNewActivity',
    function (user, date, kind = "ordinary", pict_Name, pict_Body, attach_Name, attach_Body, ...restArgs) {

        let searchDate = 0;
        let newItem = 0;

        console.log('...restArgs = ' + restArgs);

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
            savNewActivity(searchDate, docCount, kind);
            // console.log('docCount = ' + docCount);

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


            //console.log('1 newActivity.meow() = ' + newActivity.meow());


        }; // savNewActivity

    } // crtNewActivity

); // activitySchema.static('crtNewActivity') 

var Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;

