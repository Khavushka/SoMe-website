
const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');


 // følger brugere

 // henter alle brugere
 exports.getUsers = async function (req, res) {
    let users = await userSchema.find({}, null,{});
    // await userSchema.find({}, function(err, user){
    // let users = user.uid;
    // return users
    //);}
    return users;


}
 // henter yaddas


//  if (sort === null)
//  sort = {sort: {name: 1}};
// try {
//  // await er asynkront og venter, til den får info
//  let users = await User.find({
//      role: "unverified"}, null,{});  // await er asynkront og venter, til den får info
//  let emails = User.email;
//  return users;
// } catch (e) {
//  console.log(e);
// } db.close();
// console.log(emails);
// }