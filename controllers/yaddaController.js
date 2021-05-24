
const mongoose = require('mongoose');
const followSchema = require('../models/followSchema');
const userSchema = require('../models/userSchema');
const yaddaSchema = require('../models/yaddaSchema')
const fs = require('fs');
const formidable = require('formidable');


// Til Hashtag
const hashTag = function(yaddas){
    const regex = /(\#)(\w+)/g;
    let subst = "<a href='/feed/$2'> $1$2 </a>"; // $1 $2 = hashtag symbol
    let txt = yaddas.replace(regex, subst);
    return txt;
};

const linkifyHashes = function(yaddas){
    for (let i = 0; i < yaddas.length; i++) {
        let repltxt = hashTag(yaddas[i].content);
        yaddas[i].content = repltxt;
    }
}

// Links Til brugernavne
const userId = function(yaddas){
    const regex = /(@)(\w+)/g;
    let subst = `<a href='/users/lookup/$2'>$1$2</a>`;
    let txt = yaddas.replace(regex, subst);
    return txt;
}

const linkifyHandles = function(yaddas){            // niels kalder brugernavn handles
    for(let i = 0; i < yaddas.length; i++) {
        let repltxt1 = userId(yaddas[i].bywhom);
        yaddas[i].bywhom = repltxt1;
    }
}

exports.getWithHashtag = async function (req, res){
    let query = {}; //til database
    let subtitle = ' ';
    let yaddareplies = '';
    if(req.params.hashtag){
        let hashtag = '#' + req.params.hashtag;
        let regex = new RegExp(hashtag, "i");
        query = { //når man trykker på en hashtag
            content: regex
        };
        subtitle = 'Hashtag: ' + hashtag;
    }

    if(req.params.replies){
        let replies = req.params.replies;
        console.log(replies);
        let replyreply = await yaddaSchema.find({'replyTo': replies});
        query = {
        $or: [{'_id': replies}, {'replyTo': replies}, {'replyTo': replyreply}] // Her bruger vi $or til at vælge den kan have flere conditions og altså ikke skal have de to conditions opfyldt. Den tager det ene eller det andet
        };
    }
    let yaddas = await yaddaSchema.find(query).sort({timestamp: -1});//til at sortere oplæg
    linkifyHashes(yaddas);
    linkifyHandles(yaddas);
    console.log(yaddas);
    return yaddas;
}


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

// få yaddaer
exports.getYaddas = async function(req, res) {
    let yaddas = await yaddaSchema.find({replyTo: {$eq: null}});
    return yaddas;
}

// få yaddaer med bestemt hashtag
exports.getYaddas = async function(req, res) {
    let yaddas = await yaddaSchema.find({replyTo: {$eq: null}});
    return yaddas;
}

// post dine yaddas
exports.postYadda = async function(req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files) {
        if (err) {console.error(err);}
    
    let {content} = fields; // fra vores yaddaform
    let yaddareply = req.params.yadda;
    let uid = req.user.uid;

    let yadda = new yaddaSchema({
        bywhom: req.user.uid,
        content,
        replyTo: yaddareply
    });
    if (yadda && yadda.image) {

        yadda.image.data = await fs.readFileSync(files.image.path) // read uploaded image
        yadda.image.contentType = files.image.type;
    //måske {runValidators: true}, som option til save() for schema validering? Men hvor skal den stå?
    }
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
    });
}

//dzsh@iba.dk
exports.lookupYaddaImage = async function (req, res, next) {
    let query = req.params.id;
    let yadda = await yaddaSchema.findOne({_id: query});
    if (yadda && yadda.image && yadda.image.data.length > 0) {
        res.contentType(yadda.image.contentType);
        res.send(yadda.image.data);
    } else {
        return;
    }
};


// reply yaddas
exports.getReplies = async function(req, yaddas){
    let yaddaids = [];            
    for (item in yaddas) {         
    yaddaids.push(yaddas[item].id); 
    }
    let yaddareplies = await yaddaSchema.find({replyTo:{$in: yaddaids}}).sort({timestamp: 1}); //sortere opslag 

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