
const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');
const yaddaSchema = require('../models/yaddaSchema')

// Til Hashtag
// const hashTag = function(yadda){
//     const regex = /(\#)(\w+)/g;
//     let subst = `<a href='/her skal være link/'>$1$2</a>`;
//     let txt = yadda.replace(regex, subst);
// };

// const userId = function(yadda){
//     const reqex = /(@)(\w+)/g;
//     let subst = `<a href='link til'>$1$2</a>`;
//     let txt = yadda.replace(reqex, subst);
//     return txt;
// }

// const linkiHashes = function(yaddas){
//     for (let i = 0; i < yaddas.length; i++) {
//         let repltxt = hashTag(yaddas[i].content);
//         yaddas[i].content = repltxt;
//     }
// }

// const linkifyHandles = function(yaddas){
//     for(let i = 0; i < yaddas.length; i++) {
//         let repltxt = userId(yaddas[i].content);
//         yaddas[i].content = repltxt;
//     }
// }

// exports.getWithHashtag = async function (req, res){
//     let query = {};
//     let subtitle = ' ';
//     if(req.params.hashtag){
//         let hashtag = '#' + req.params.hashtag;
//         let regex = new RegExp(hashtag, "i");
//         query = {
//             content: reqex
//         };
//         subtitle = 'Hashtag:' + hashtag;
//     }
//     const yaddas = await yaddaSchema.find(query, {sort: {created: -1}});
//     linkifyHashes(yaddas);
//     linkifyHandles(yaddas);
//     res.render('feed', {
//         user: req.user,
//         subtitle: subtitle,
//         yaddas
//     })
// }


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
    let yaddas = await yaddaSchema.find({replyTo: {$eq: null}});
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
exports.getReplies = async function(req, yaddas){
    let yaddaids = [];            
    for (item in yaddas) {         
    yaddaids.push(yaddas[item].id); 
    }
    let yaddareplies = await yaddaSchema.find({replyTo:{$in: yaddaids}});


    console.log(yaddareplies);

    return yaddareplies;   
    
}

/*yaddas.forEach(function(item.id) {
    let yaddareplies = await yaddaSchema.find({
        replyTo: id
    });
    console.log(yaddareplies);
    return yaddareplies;
   }
});*/

//     for (item in yaddas[item.id]) {
        
//     let yaddareplies = await yaddaSchema.find({
//         replyTo: id
//     });
//     console.log(yaddareplies);
//     return yaddareplies;
//    }

 /*let yaddareplies = async function myfunction(item) {
        await yaddaSchema.find({replyTo: item});
    }
    yaddaids.forEach(myfunction);

    console.log(yaddareplies);
    return yaddareplies;*/