const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: false,
        unique: false
    },
    suggestion: {
        type: String,
        required: false,
        unique: false
    },
    evaluation: {
        type: String,
        required: false,
        unique: false
    },

    
    code: {
        type: String,
        required: false,
        unique: false
    },
    name: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    phone: {
        type: String,
        required: false,
        unique: false
    }

})

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;