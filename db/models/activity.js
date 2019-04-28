var mongoose = require('mongoose');

var fs = require('fs');
var url = require('url');
var path = require('path');

var ROOT = __dirname + "/../../public";
var FILEROORDIR = ROOT + "/images";

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
            text: String,
            body: Buffer
        },
        attachment: {
            name: String,
            text: String,
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
    function (user, date = undefined, kind = "ordinary",
        pict_Name, pict_Text, pict_Body,
        attach_Name, attach_Text, attach_Body,
        ...restArgs) {

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
                    Description.crtNewDescription(user, searchDate, newItem,
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
                            text: pict_Text,
                            body: pict_Body
                        },
                        attachment: {
                            name: attach_Name,
                            text: attach_Text,
                            body: attach_Body
                        }
                    },
                    log: {
                        usernamecrt: user
                    }
                });

            newActivity.save(function (err, newActivity) {
                if (err) return console.error(err);

                // Save files to local file system
                saveFileToLocal(itemDate, newItem, pict_Name, pict_Body);
                saveFileToLocal(itemDate, newItem, attach_Name, attach_Body);

            });

        }; // savNewActivity()

    } // crtNewActivity()

); // activitySchema.static('crtNewActivity') 

activitySchema.static('updActivity',
    function (user, date = undefined, item = undefined, kind = "ordinary",
        pict_Name, pict_Text, pict_Body,
        attach_Name, attach_Text, attach_Body,
        ...restArgs) {

        let searchDate = 0;
        let updItem = 0;

        if (date) {
            searchDate = date;
        }

        if (searchDate <= 0) { // Update today's activity
            let today = new Date();
            searchDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        }

        if (item) {
            updItem = item;
        }

        if (updItem <= 0) { // Update last activity at date

            Activity.countDocuments({ date: searchDate }, function (err, docCount) {
                if (err) return handleError(err);
                updItem = docCount;

                Activity.findOne({ date: searchDate, item: updItem, active: "Y" }, function (err, thisActivity) {
                    if (err) return handleError(err);
                    savActivity(thisActivity);

                    if (restArgs.length > 0) {
                        for (let index = 0; index < restArgs[0].length; index++) {
                            Description.updDescription(user, searchDate, updItem,
                                restArgs[0][index].langcode,
                                restArgs[0][index].text);
                        }
                    }

                });

            });

        } else {

            Activity.findOne({ date: searchDate, item: updItem, active: "Y" }, function (err, thisActivity) {
                if (err) return handleError(err);
                savActivity(thisActivity);

                if (restArgs.length > 0) {
                    for (let index = 0; index < restArgs[0].length; index++) {
                        Description.updDescription(user, searchDate, updItem,
                            restArgs[0][index].langcode,
                            restArgs[0][index].text);
                    }
                }

            });
        }

        // New item number for the date
        // let promiseCount = Activity.countDocuments({ date: searchDate }).exec();
        // promiseCount.then(function (docCount) { savNewActivity(docCount); })

        function savActivity(parActivity) {

            if (parActivity == null) { return; }

            parActivity.data.kind = kind;
            parActivity.log.updated = new Date();
            parActivity.log.usernameupd = user;

            // Picture
            if (pict_Name) {
                parActivity.data.picture.name = pict_Name
            }
            if (pict_Text) {
                parActivity.data.picture.text = pict_Text
            }
            if (pict_Body) {
                parActivity.data.picture.body = pict_Body
            }

            // Attachment
            if (attach_Name) {
                parActivity.data.attachment.name = attach_Name
            }
            if (attach_Text) {
                parActivity.data.attachment.text = attach_Text
            }
            if (attach_Body) {
                parActivity.data.attachment.body = attach_Body
            }

            parActivity.save(function (err, parActivity) {
                if (err) return console.error(err);

                // Save files to local file system
                saveFileToLocal(parActivity.date, parActivity.item,
                    parActivity.data.picture.name, parActivity.data.picture.body);
                saveFileToLocal(parActivity.date, parActivity.item,
                    parActivity.data.attachment.name, parActivity.data.attachment.body);
            });

        }; // savActivity()

    } // updActivity()

); // activitySchema.static('updActivity') 

activitySchema.static('dltActivity',
    function (user, date, item) {

        let searchDate = date;
        let dltItem = item;

        Activity.findOne({ date: searchDate, item: dltItem, active: "Y" }, function (err, thisActivity) {
            if (err) return handleError(err);
            deactActivity(thisActivity);
            Description.dltDescription(user, searchDate, dltItem);
        });

        // New item number for the date
        // let promiseCount = Activity.countDocuments({ date: searchDate }).exec();
        // promiseCount.then(function (docCount) { savNewActivity(docCount); })

        function deactActivity(parActivity) {

            if (parActivity == null) { return; }

            parActivity.active = "N";
            parActivity.log.updated = new Date();
            parActivity.log.usernameupd = user;

            parActivity.save(function (err, parActivity) {
                if (err) return console.error(err);
            });

        }; // dltActivity()

    } // dltActivity()

); // activitySchema.static('dltActivity') 

// Save file to local file system
function saveFileToLocal(sfDate, sfItem, sfFileName, sfFileBody) {

    let fileDir = "";
    let fileNameFull = "";
    let dirExists = "";

    if (sfFileName === "" || sfFileBody === "" ||
        sfFileName === undefined || sfFileBody === undefined) {
        return "";
    }

    fileDir = path.join(FILEROORDIR, "/" + sfDate.toString() + "_" + sfItem.toString());
    fileNameFull = path.join(fileDir, "/" + path.basename(sfFileName));

    // Create directory /public/images/YYYYMMDD_nnn
    try {
        dirExists = fs.existsSync(fileDir);
        if (!dirExists) {
            fs.mkdirSync(fileDir);
        }
    } catch (error) {
        return error;
    }

    // Save data to file in directory /public/images/YYYYMMDD_nnn/
    try {
        fs.writeFileSync(fileNameFull, sfFileBody);
    } catch (error) {
        return error;
    }

    return "";

};

var Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;

