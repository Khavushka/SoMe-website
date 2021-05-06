const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');
const yaddaSchema = require('../models/yaddaSchema')

// til at følge en bruger
exports.follow = async function(req, res, follow) {
    console.log(follow);
    const newFollow = new followSchema({
        user,
        follows
    });
    await newFollow.save().then(function(){
        res.redirect('/feed').catch(err => console.log(err))
    });
}

// henter alle brugere // tjek senere om async er nødvendigt
exports.getUsers = async function (req, res) {
   let users = await userSchema.find({}, null,{}); // find tager tre parameter, en skal være null. Tredje handler om options
   // await userSchema.find({}, function(err, user){
   // let users = user.uid;
   // return users
   //);}
   return users;
}