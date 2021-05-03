const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    user: {
        type: String, 
        required: true
    },
    follows: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Follows', followSchema, 'follows');