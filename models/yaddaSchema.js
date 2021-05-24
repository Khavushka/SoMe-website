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
        required: true, 
        minlength: 1,
        maxlength: 167
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    replyTo: {
        type: Schema.Types.ObjectId, 
        ref: "Yadda", 
        default: null
    },
    image: {                             // for image
    data: Buffer,                       // the image itself
    contentType: String                // the mimetype
    }
});

//var User  = mongoose.model('User', userSchema);

module.exports = mongoose.model('Yadda', yaddaSchema);