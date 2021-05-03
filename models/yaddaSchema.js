const mongoose = require('mongoose');

const yaddaSchema = mongoose.Schema({
    bywhom: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    timestamp: { 
        type: Date,                         // if value invalid, force to start UNIX era
        default: Date.now 
    },
    content: { type: String, required: true},
});

module.exports = mongoose.model('Yadda', yaddaSchema);