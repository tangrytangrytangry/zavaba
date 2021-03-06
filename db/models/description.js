var mongoose = require('mongoose');
const Activity = require('./activity');

var descriptionSchema = mongoose.Schema({
    date: { type: Number, required: true },
    item: { type: Number, required: true },
    langcode: { type: String, required: true },
    active: String,
    data: {
        text: { type: String, required: true }
    },
    log: {
        created: { type: Date, default: Date.now },
        usernamecrt: String,
        updated: Date,
        usernameupd: String
    }
});

// Cretae description
descriptionSchema.static('crtNewDescription',
    function (user, date = undefined, item = undefined, langcode, desc_text) {

        let searchDate = 0;
        let lastItem = 0;

        if (date) {
            searchDate = date;
        }

        if (searchDate <= 0) {
            let today = new Date();
            searchDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        }

        if (item) {
            lastItem = item;
        }

        if (lastItem <= 0) {

            Activity.countDocuments({ date: searchDate },
                function (err, docCount) {
                    if (err) return handleError(err);
                    lastItem = docCount;
                    savNewDescription(searchDate, lastItem, langcode);
                });

        } else {
            savNewDescription(searchDate, lastItem, langcode);
        }

        function savNewDescription(descDate, descItem, descLangcode) {

            var newDescription = new Description(
                {
                    date: descDate,
                    item: descItem,
                    langcode: descLangcode,
                    active: "Y",
                    data: {
                        text: desc_text
                    },
                    log: {
                        usernamecrt: user
                    }
                });

            newDescription.save(function (err, newDescription) {
                if (err) return console.error(err);
            });

        }; // savNewDescription

    } // crtNewDescription

); // descriptionSchema.static('crtNewDescription') 

// Update description
descriptionSchema.static('updDescription',
    function (user, date = undefined, item = undefined, langcode, desc_text) {

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

                Description.findOne({ date: searchDate, item: updItem, langcode: langcode, active: "Y" },
                    function (err, thisDescription) {
                        if (err) return handleError(err);
                        savDescription(thisDescription);
                    });

            });

        } else {

            Description.findOne({ date: searchDate, item: updItem, langcode: langcode, active: "Y" },
                function (err, thisDescription) {
                    if (err) return handleError(err);
                    savDescription(thisDescription);
                });

        }

        function savDescription(parDescription) {

            if (parDescription == null) { return; }

            parDescription.data.text = desc_text;
            parDescription.log.updated = new Date();
            parDescription.log.usernameupd = user;

            parDescription.save(function (err, parDescription) {
                if (err) return console.error(err);
            });

        }; // savDescription

    } // updDescription

); // descriptionSchema.static('updDescription') 

// Deactivate description
descriptionSchema.static('dltDescription',
    function (user, date, item, langcode) {

        let searchDate = date;
        let dltItem = item;

        if (langcode == undefined) {

            Description.find({ date: searchDate, item: dltItem, active: "Y" },
                function (err, theseDescriptions) {
                    if (err) return handleError(err);

                    for (let index = 0; index < theseDescriptions.length; index++) {
                        const thisDescription = theseDescriptions[index];
                        deactDescription(thisDescription);
                    }

                });

        } else {

            Description.findOne({ date: searchDate, item: dltItem, langcode: langcode, active: "Y" },
                function (err, thisDescription) {
                    if (err) return handleError(err);
                    deactDescription(thisDescription);
                });

        }

        function deactDescription(parDescription) {

            if (parDescription == null) { return; }

            parDescription.active = "N";
            parDescription.log.updated = new Date();
            parDescription.log.usernameupd = user;

            parDescription.save(function (err, parDescription) {
                if (err) return console.error(err);
            });

        }; // deactDescription

    } // dltDescription

); // descriptionSchema.static('dltDescription') 

// Activate description
descriptionSchema.static('actDescription',
    function (user, date, item, langcode) {

        let searchDate = date;
        let dltItem = item;

        if (langcode == undefined) {

            Description.find({ date: searchDate, item: dltItem, active: "N" },
                function (err, theseDescriptions) {
                    if (err) return handleError(err);

                    for (let index = 0; index < theseDescriptions.length; index++) {
                        const thisDescription = theseDescriptions[index];
                        activateDescription(thisDescription);
                    }

                });

        } else {

            Description.findOne({ date: searchDate, item: dltItem, langcode: langcode, active: "N" },
                function (err, thisDescription) {
                    if (err) return handleError(err);
                    activateDescription(thisDescription);
                });

        }

        function activateDescription(parDescription) {

            if (parDescription == null) { return; }

            parDescription.active = "Y";
            parDescription.log.updated = new Date();
            parDescription.log.usernameupd = user;

            parDescription.save(function (err, parDescription) {
                if (err) return console.error(err);
            });

        }; // activateDescription

    } // actDescription

); // descriptionSchema.static('actDescription') 

var Description = mongoose.model('Description', descriptionSchema);
module.exports = Description;
