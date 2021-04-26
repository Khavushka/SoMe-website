const mongoose = require('mongoose');

const imgSchema = mongoose.Schema({
    bywhom: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    date: {     
        type: Date,                         // if value invalid, force to start UNIX era
        default: Date.now  
    },
    mimetype: { type: String, required: true, unique: true },
    image: { type: String, required: true },
});

module.exports = mongoose.model('Img', imgSchema);