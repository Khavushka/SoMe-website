
const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');
const yaddaSchema = require('../models/yaddaSchema')


 // følger brugere

 // henter alle brugere // tjek senere om async er nødvendigt
 exports.getUsers = async function (req, res) {
    let users = await userSchema.find({}, null,{}); // find tager tre parameter, en skal være null. Tredje handler om options
    // await userSchema.find({}, function(err, user){
    // let users = user.uid;
    // return users
    //);}
    return users;
}

// Sender brugeren videre til en post yadda side
exports.gotoYaddaform = async function(req, uid) {
    let friend = await userSchema.findOne({uid: uid});
    console.log(uid);
    console.log(friend);
    return friend;
}

exports.adminUser = async function(req) {

   
}

exports.deleteUser = async function(req) {

  
}

 // henter yaddas
