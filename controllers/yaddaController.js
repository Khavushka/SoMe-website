
const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');
const yaddaSchema = require('../models/yaddaSchema')

// Sender brugeren videre til en post yadda side
exports.gotoYaddaform = async function(req, uid) {
    let friend = await userSchema.findOne({uid: uid});
    if(friend) {
        return friend;  
    } else {
        friend = "";
        return friend;
    }    
}

exports.adminUser = async function(req) {

   
}

exports.deleteUser = async function(req) {

  
}

 // henter yaddas
