
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
        errors.push({ msg: 'Passwords do not match' }); //passwordr = password repeat
    }

    if (password.length < 4 ) {
        errors.push({ msg: 'Password must be at least 4 characters' });
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

                    bcrypt.hash(newUser.password, saltRounds, async function (err, hash) {
                        newUser.password = hash;
                        newUser.verified = false;
                        newUser.verify_token = verification_token;

                        try {
                            newUser.save(function (err) {
                                if (err) {

                                    throw err;
                                } else {
                                    VerifyEmail.sendverification(email, verification_token, permalink);
                                    // .then(function msg() {
                                    //     req.flash(
                                    //         'success_msg',
                                    //         'Verification email has been sent'
                                    //     );
                                    //     res.redirect('/users/login');
                                    // });
                                    
                                }
                            });
                        } catch (err) {

                        }
                    });
                }
          });
      }
  };

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