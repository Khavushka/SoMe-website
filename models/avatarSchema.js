const mongoose = require('mongoose');

const avatarSchema = mongoose.Schema({
    handle: { 
        type: mongoose.Schema.Types.handle,
        ref: 'User' 
    },
    image: { type: String, required: true },
    mimetype: { type: String, required: true }
});

module.exports = mongoose.model('Avatar', avatarSchema);