const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    uid: { 
        type: String, 
        required: true, 
        unique: true 
    }, //handle er username
    password: { 
        type: String, 
        required: true
    },
    role: {
        type: String,
        enum: ['verified', 'admin', 'unverified'], 
        default: 'admin'
    },
    avatar: { 
        data: Buffer,
        contentType: String
    }
});



// module.exports = mongoose.model('User', userSchema); /* The first argument is the singular name of the collection 
                                                        // that will be created for your model, the second argument
                                                        // is the schema you want to use in creating the model */

module.exports = mongoose.model('User', userSchema, 'users');