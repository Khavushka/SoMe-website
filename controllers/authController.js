
//Fra Example A.278. Authentication Controller, controllers/authController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const randomstring = require("randomstring");
const fs = require('fs');
const formidable = require('formidable');

const userSchema = require('../models/userSchema');
const VerifyEmail = require('../config/nodemail');

const saltRounds = 10;

exports.register = function (req, res) {
    res.render('register', {
            title: 'registered'
    });
};

exports.postRegister = function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {
        if (err) {console.error(err);}

    let { name, uid, email, avatar, password, passwordr } = fields;
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
    } 
    let user = userSchema.findOne({ uid: uid })
            .then( async function (user) { // tjek om async
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
                    var permalink = fields.uid.toLowerCase().replace(' ', '').replace(/[^\w\s]/gi, '').trim();
                    var verification_token = randomstring.generate({
                    length: 64
                    });
                    newUser.verify_token = verification_token;
                    newUser.permalink = permalink;
                    newUser.avatar.data = await fs.readFileSync(files.avatar.path) // tjek om await er nødvendigt //read uploaded image
                    newUser.avatar.contentType = files.avatar.type;

                  bcrypt.hash(newUser.password, saltRounds, async function (err, hash) {
                      if (err) throw err;
                      newUser.password = hash;
                        await VerifyEmail.sendverification(email, verification_token, permalink);
                      newUser.save()
                          .then(user => {
                              req.flash(
                                  'success_msg',
                                  'You are now registered. Please check your email to get verified.'
                              );
                              res.redirect('/users/login');
                          })
                          .catch(err => console.log(err));
                  });
              }
        });
    });
}

//Tilpasset fra https://stackoverflow.com/questions/28847491/verification-email-with-token-in-passport-js
exports.verify = function (req, res) {
    var permalink = req.params.permalink;
    var token = req.params.token;
    userSchema.findOne({permalink: permalink}, function (err, user) {
        if (user.verify_token == token) {
            userSchema.findOneAndUpdate({permalink: permalink}, {role: "verified"}, function (err, resp) {
                req.flash('success_msg', 'User email has been verified');
                res.redirect('/users/login');
             });
             } else {
           //console.log('The token was wrong! Reject the user. token should be: ' + user.verify_token);
            req.flash('error', 'The token was wrong!');
            res.redirect('/users/login');
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
    let user = await userSchema.findOne({uid: req.body.uid}); //altid async og await når vi henter fra DB                             
    if (user && user.role == "unverified") { /* Hvis user role er identisk med unverified */
        req.flash('error', 'User must have a verified email address');
        res.redirect('/users/login');
    } else { 
        passport.authenticate('local', {
            successRedirect: '/feed', // når man logger ind, så bliver man taget til feed
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

