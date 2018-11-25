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

descriptionSchema.static('crtNewDescription',
    function (user, date, item = undefined, langcode, desc_text) {

        let lastItem = 0;

        if (item) {
            lastItem = item;
        }

        if (lastItem === 0) {

            Activity.countDocuments({ date: date }, function (err, docCount) {
                if (err) return handleError(err);
                lastItem = docCount;
                savNewDescription(date, lastItem, langcode);
            });

        } else {
            savNewDescription(date, lastItem, langcode);
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

var Description = mongoose.model('Description', descriptionSchema);
module.exports = Description;

