//fra Example A.279. Passport Config, config/passport.js

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/userSchema');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'uid'
        }, function (uid, password, done) {
        // Match user
        User.findOne({ uid: uid })
            .then(function (user) {
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }
                // Match password
                    bcrypt.compare(password, user.password, function (err, isMatch) {
                        if (err) throw err;
                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'Password incorrect' });
                            }
                        });

            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id, user.role);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

