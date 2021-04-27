
//Fra Example A.278. Authentication Controller, controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

const User = require('../models/user/userSchema');
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

                  bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser
                          .save()
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

exports.login = function (req, res) {
    res.render('login', {
        title: 'Login'
    });
};

exports.postLogin = function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
};

exports.logout = function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
};