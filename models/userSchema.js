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

module.exports = mongoose.model('User', userSchema, 'users');