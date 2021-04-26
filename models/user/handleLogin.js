'use strict';
const User = require("./userSchema");
const bcrypt = require('bcryptjs'); 
const session = require('express-session');
const mongoose = require("mongoose");

exports.getLogin = async function (que, sort) {
	let userid;
	let success = false;
    /*if (sort === null)
        sort = {sort: {name: 1}};*/
    try {
        /*let users = await mon.retrieve(dbServer, dbName, User, que, sort); // await er asynkront og venter, til den får info
		console.log(users);*/

		User.findOne({
				id: req.body.id
		}).then(function(result){
			userid = result;
			console.log(userid.getInfo()); 
			
		});
		//console.log(userid);
		//console.log(req.body.uid);
		if (req.body.id === userid) {
			success = await bcrypt.compare(req.body.password, user.password);
			if (success) {
				req.session.authenticated =true;
				req.session.user = users[0].firstName;
				} else {
					req.session = undefined;
				}
				return success;
			}
		
		}catch(e) {
    	console.log(e.message);
    }
}
