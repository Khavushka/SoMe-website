'use strict';

const User = require("./userSchema");
const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose');

exports.getUsers = async function (que, sort) {
    await mongoose.connect(CONSTR, CONPARAM);
    const db = mongoose.connection;
    db.once("open", function() {
    console.log("connected to server by mongoose")
    });
    
    if (sort === null)
        sort = {sort: {name: 1}};
    try {
        // await er asynkront og venter, til den får info
        let users = await User.find({
            role: "unverified"}, null,{});
        let emails = User.email;
        return users;
    } catch (e) {
        console.log(e);
    } db.close();
    console.log(emails);
}

exports.postUsers = async function (req) { // Register users

    let user = new User({                     // create object in db-format
        realname: req.body.realname,
        email: req.body.email,
        uid: req.body.uid,
        password: req.body.password
    });
    /*let pwd = await bcrypt.hash(req.body.password, 10);
    //console.log(pwd);
    user.password = pwd;
    //console.log(req.body.password);*/
    User.create(user, function(error, savedDocument) { //create er en mongoose funktion
    if (error) {
        console.log(error);
        } db.close();
    });
}

exports.verifyUser = async function(req) {
    await mongoose.connect(CONSTR, CONPARAM);
    const db = mongoose.connection;
    db.once("open", function() {
        console.log("connected to server by mongoose")
    });
    console.log(req.params.email);
    await User.findOneAndUpdate({email:req.params.email}, {role: "verified"})
    .then(function(){console.log("Data deleted");})
    .catch(function(error){console.log(error); // Failure
    })
    
    db.close();
}

exports.adminUser = async function(req) {
    await mongoose.connect(CONSTR, CONPARAM);
    const db = mongoose.connection;
    db.once("open", function() {
        console.log("connected to server by mongoose")
    });
    console.log(req.params.email);
    await User.findOneAndUpdate({email:req.params.email}, {role: "admin"})
    .then(function(){console.log("Data deleted");})
    .catch(function(error){console.log(error); // Failure
    })
    
    db.close();
}

exports.deleteUser = async function(req) {
    await mongoose.connect(CONSTR, CONPARAM);
    const db = mongoose.connection;
    db.once("open", function() {
        console.log("connected to server by mongoose")
    });
    console.log(req.params.email);
    await User.findOneAndDelete({email: req.params.email})
    .then(function(){console.log("Data deleted");})
    .catch(function(error){console.log(error); // Failure
    })
    
    db.close();
}