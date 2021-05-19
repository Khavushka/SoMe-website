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
    res.redirect('/users/showsall');
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
  let follows = await followSchema.find({user: uid}); //Output fra denne find() er et array med et object for hver bruger
  let followsArr = [];            //Vi skal bruge et array med brugernavne på follows til filteret i linje 36
  followsArr.push(uid);
  for (item in follows) {         //for løkken iterere igennem det array vi får som output fra linje 31
  followsArr.push(follows[item].follows); //
  }
  let users = await userSchema.find({uid: {$nin: followsArr}}); //det array vi har lavet bruges i filteret sammen med $nin som betyder "not in"
  return users;

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
    
}

exports.getFollows = async function (req, res) {
  let uid = req.user.uid;
  let follows = await followSchema.find({user: uid}, null,{}); // find uden et filter
  return follows;
}

// dzsh@iba.dk
// Henter avatar til user
exports.lookupAvatar = async function (req, res) {
  let query = req.params.uid;
  console.log(query);
  let user = await userSchema.findOne({uid: query});
  res.contentType(user.avatar.contentType);
  res.send(user.avatar.data);
};