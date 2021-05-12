const mongoose = require('mongoose'), Schema = mongoose.Schema;

const yaddaSchema = mongoose.Schema({
    bywhom: {  
        type: String 
    },
    timestamp: { 
        type: Date,                         // if value invalid, force to start UNIX era
        default: Date.now 
    },
    content: { 
        type: String, 
        // match: /([a-z])\w+,
        /*validate: {
            validator: function(v) {
            return /^[A-Z][A-Za-z]{2}\d{2}[a-z]{0,1}$/.test(v);
        },*/
        required: true, 
        minlength: 1,
        maxlength: 200
    },
    replyTo: [{
     type: Schema.Types.ObjectId, ref: "yaddaSchema"}]
     /*,
    image: {                             // for image
    data: Buffer,                       // the image itself
    contentType: String                 // the mimetype
    }*/
});

//var User  = mongoose.model('User', userSchema);

module.exports = mongoose.model('Yadda', yaddaSchema);