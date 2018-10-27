var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
    date: { type: Date, required: true },
    item: { type: Number, required: true },
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
        usernameupd: Date
    }
});

var Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;

