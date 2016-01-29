var jwt = require('passport-jwt'),
    JwtStrategy = jwt.Strategy,
    config = require('./config');

var User = require('../models/user');

module.exports = function (passport) {
    var opts = {}
    opts.secretOrKey = config.auth.secret;
    opts.issuer = config.auth.issuer;
    opts.audience = config.auth.audience;

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({_id: jwt_payload.id}, function (error, user) {
            if (error) {
                return done(error, false);
            }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
    }));
};