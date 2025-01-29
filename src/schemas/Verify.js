const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    document: {
        type: Number,
        required: true,
        unique: true
    },
    images: {
        type: [String]
    }
})

const verify = mongoose.model('verify', verifySchema);

module.exports = verify;