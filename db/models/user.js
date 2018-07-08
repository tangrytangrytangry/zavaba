var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    authId: String,
    role: String,
    created: Date,
    admin: Boolean,
    active: Boolean,
    personalData: {
        name: String,
        email: String
    }
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);
module.exports = User;
