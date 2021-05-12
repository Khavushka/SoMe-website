
const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');
const yaddaSchema = require('../models/yaddaSchema')

// Sender brugeren videre til en post yadda side
exports.gotoYaddaform = async function(req, res) {
	let uid = req.params.uid;
    let friend = await userSchema.findOne({uid: uid});
    if(friend) {
        return friend;  
    } else {
        friend = "";
        return friend;
    }    
}
exports.getYaddas = async function(req, res) {
    let yaddas = await yaddaSchema.find({}, null, {});
    return yaddas;
}

// post dine yaddas
exports.postYadda = async function(req, res) {
    let yaddareply = req.params.yadda;
    let uid = req.user.uid;
    let yadda = new yaddaSchema({
        bywhom: req.user.uid,
        content: req.body.content,
        replyTo: yaddareply
    });
//måske {runValidators: true}, som option til save() for schema validering? Men hvor skal den stå?
    yadda.save(function (err) {
        if (err) {
            req.flash(
                'error',
                'Something went wrong! The post was not saved.'
            );
        res.redirect('/yaddaform');
        } else {
            req.flash(
                'success_msg',
                'The post was saved.'
            );
        res.redirect('/feed');
        }
    });
}


// reply yaddas
exports.getReplies = async function(req, res){
    for (id in yaddas.id) {
        
    let yaddareplies = await yaddaSchema.find({
        replyTo: id
    });
    return yaddareplies;
    }
}

