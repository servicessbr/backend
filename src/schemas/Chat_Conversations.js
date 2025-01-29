const mongoose = require('mongoose');

const chat_conversationSchema = new mongoose.Schema({
    conv_id: {
        uid: {
            // user_uid + receiver_uid
            type: String,
            require: true,
            unique: true
        }
    },
    user: {
        uid: {
            type: String,
            require: true
        },

        author_number: {
            type: Number,
            require: true,
            default: 0,
            min: 0,
            max: 0,
        }
    },
    receivar: {
        uid: {
            type: String,
            require: true
        },

        author_number: {
            type: Number,
            require: true,
            default: 1,
            min: 1,
            max: 1,
        }
    },
    messages: [
        {
            text: {
                type: String,
                require: true
            },
            author_number: {
                type: Number,
                require: true,
                min: 0,
                max: 1,
            },
            time: {
                type: String,
                require: true
            },
            date: {
                type: Date,
                require: true,
                default: Date.now
            },
            deleted: {
                type: Boolean,
                require: true,
                default: false
            }
        }
    ]
})

const Chat_Conversation = mongoose.model('Chat_Conversation', chat_conversationSchema);

module.exports = Chat_Conversation;