const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');
const yaddaSchema = require('../models/yaddaSchema')

// til at følge en bruger
exports.follow = async function(req, res, next) {
    var user = req.user.uid;
    var follows = req.params.uid;
    const newFollow = new followSchema({
      user,
      follows
    });
    await newFollow.save().then(function(){
    res.redirect('/users/showsfollows');
    });
}

// unfollow
exports.unfollow = async function(req, res, next) {
  var uid = req.user.uid;
  var follows = req.params.uid;
    await followSchema.findOneAndRemove({user: uid, follows: follows}).then(function(){
    res.redirect('/users/showsfollows');
    });
};

// henter alle brugere // tjek senere om async er nødvendigt
exports.getUsers = async function (req, res) {
  let uid = req.user.uid;
  let follows = await followSchema.find({user: uid});
  let users = await userSchema.find({uid: {$ne: follows.follows}}); // find tager tre parameter, en skal være null. Tredje handler om options
  // let followsArr = [follows.follows]; // Vi bruger array bl.a. for ikke at komme til at slette i db
  // let usersArr = [users.uid];
  // followsArr.length === usersArr.length && 
  // followsArr.every(function (element) {
  //   if (usersArr.includes(element)) {
  //     usersArr.slice(element);
  //   };
  // });
  // console.log(usersArr);
  //  return usersArr;
   return users;
}

exports.getFollows = async function (req, res) {
  let uid = req.user.uid;
  let follows = await followSchema.find({user: uid}, null,{}); // find uden et filter
  return follows;
}