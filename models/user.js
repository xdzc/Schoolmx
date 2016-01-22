var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timestamps = require('mongoose-timestamp'),
    bcrypt = require('bcrypt');
    uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new Schema({
    name: {
        first: { type: String, required: true},
        middle: { type: String, required: false},
        last: { type: String, required: true}
    },
    email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true},
    username: { type: String, required: false, unique: true},
    password: String,
    token: String,
    lastLogin: Date,
    resetPassword: {
        token: String,
        expiration: Date
    },
    address: {
        lineOne: String, //Address Line 1
        lineTwo: String, //Address Line 2
        city: String,
        state: String, //State/Province/Region
        postalCode: String, //ZIP/Postal Code
        country: String
    },
    picture: String,
    dob: Date,
    gender: String,
    active: { type: Boolean, default: false}
});

UserSchema.virtual('name.full').get(function () {
    var name = this.name.last;
    if (this.name.middle) name += ', ' + this.name.middle;
    name += ' ' + this.name.first;
    return name;
});

UserSchema.virtual('name.simple').get(function () {
    return this.name.last + ', ' + this.name.first;
});

UserSchema.virtual('age').get(function () {
    try {
        var dob = this.dob;
        var today = new Date();

        var age = today.getFullYear() - dob.getFullYear();
        var months = today.getMonth - dob.getMonth();
        if (months < 0 || (months === 0 && today.getDate() < dob.getDate()))
            age--;
    } catch (error) {
        return "Not specified";
    }

    return age;
});

UserSchema.virtual('address.full').get(function (separator) {
    var address = this.address.lineOne;
    if (this.address.lineTwo) address += separator + this.address.lineTwo;

    address += separator + this.address.city + separator + this.address.postalCode + separator +
            this.address.state + separator + this.address.country;
    return address;
});

UserSchema.methods.generateHash = function (password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(timestamps);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);