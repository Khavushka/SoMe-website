
//Fra Example A.278. Authentication Controller, controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const randomstring = require("randomstring");

const userSchema = require('../models/userSchema');
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
        userSchema.findOne({ uid: uid })
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
                  const newUser = new userSchema({
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

//Tilpasset fra https://stackoverflow.com/questions/28847491/verification-email-with-token-in-passport-js
exports.verify = function (req, res) {
    var permalink = req.params.permalink;
    var token = req.params.token;
    userSchema.findOne({permalink: permalink}, function (err, user) {
        if (user.verify_token == token) {
            console.log('that token is correct! Verify the user');
            userSchema.findOneAndUpdate({permalink: permalink}, {role: "verified"}, function (err, resp) {
                //De 2 console.log her skal laves om så de bruger flash og beskederne skal være upræcise
                console.log('The user has been verified!');
             });
             } else {
           console.log('The token is wrong! Reject the user. token should be: ' + user.verify_token);
             }
         });
}

exports.login = function (req, res) {
    res.render('login', {
        title: 'Login'
    });
};

exports.postLogin = async function (req, res, next) {
    /* Før login henter vi bruger data fra db og
    laver et check på om brugeren er verificeret eller admin */
    let user = userSchema.findOne({uid: req.body.uid});                                    
    if (user && user.role == "unverified") { /* Hvis user role er identisk med unverified */
        req.flash('error', 'User must have a  verified email address');
        res.redirect('/users/login');
    } else { 
        passport.authenticate('local', {
            successRedirect: '/feed',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }  
};

exports.logout = function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
};
