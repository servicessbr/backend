const mongoose = require('mongoose');

const Chat_inBoxSchema = new mongoose.Schema({
    users_uid: {
        type: String,
        require: true,
        unique: true
    },
    senders_list: [
        {
            sender_uid: {
                type: String,
                require: false,
                unique: false
            },
            amount: {
                type: Number,
                require: true,
                default: 1,
                min: 1
            },
            last_text: {
                type: String,
                maxLength: 20
            }
        }
    ]
})

const Chat_inBox = mongoose.model('Chat_inBox', Chat_inBoxSchema);

module.exports = Chat_inBox;