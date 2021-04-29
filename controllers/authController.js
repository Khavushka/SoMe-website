
//Fra Example A.278. Authentication Controller, controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const randomstring = require("randomstring");

const User = require('../models/user/userSchema');
const VerifyEmail = require('../config/nodemail');

const saltRounds = 10;

exports.register = function (req, res) {
    res.render('register', {
            title: 'registered'
    });
};

exports.postRegister = function (req, res) {
    let { name, uid, email, password, passwordr } = req.body;
    let errors = [];

    if (!name || !uid || !email || !password || !passwordr) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != passwordr) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 4 ) {
        errors.push({ msg: 'Password must be at least 32 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            uid,
            email,
            password,
            passwordr
        });
    } else {
        User.findOne({ uid: uid })
            .then( function (user) {
              if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    uid,
                    email,
                    password,
                    passwordr
                });
              } else {
                  const newUser = new User({
                      name,
                      uid,
                      email,
                      password
                  });
                    var permalink = req.body.uid.toLowerCase().replace(' ', '').replace(/[^\w\s]/gi, '').trim();
                    var verification_token = randomstring.generate({
                    length: 64
                    });
                    newUser.verify_token = verification_token;
                    newUser.permalink = permalink;

                  bcrypt.hash(newUser.password, saltRounds, async function (err, hash) {
                      if (err) throw err;
                      newUser.password = hash;
                        await VerifyEmail.sendverification(email, verification_token, permalink);
                      newUser.save()
                          .then(user => {
                              req.flash(
                                  'success_msg',
                                  'You are now registered and can log in'
                              );
                              res.redirect('/');
                          })
                          .catch(err => console.log(err));
                  });
              }
        });
    }
};
// newUser.verify_token = verification_token;
// newUser.permalink = permalink;
// VerifyEmail.sendverification(email, verification_token, permalink);
// var permalink = req.body.uid.toLowerCase().replace(' ', '').replace(/[^\w\s]/gi, '').trim();
// var verification_token = randomstring.generate({
//         length: 64
//     });


exports.login = function (req, res) {
    res.render('login', {
        title: 'Login'
    });
};

exports.postLogin = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
};