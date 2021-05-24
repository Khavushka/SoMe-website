const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    uid: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true
    },
    role: {
        type: String,
        enum: ['verified', 'admin', 'unverified'], 
        default: 'unverified'
    },
    avatar: { 
        data: Buffer,
        contentType: String
    },
    verify_token: {
        type: String
    },
    permalink: {
        type: String
    }
});

// module.exports = mongoose.model('User', userSchema); /* The first argument is the singular name of the collection 
                                                        // that will be created for your model, the second argument
                                                        // is the schema you want to use in creating the model */

module.exports = mongoose.model('User', userSchema, 'users');