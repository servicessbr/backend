const mongoose = require('mongoose');

const chat_channelSchema = new mongoose.Schema({
    uid: {
        type: String,
        require: true,
        unique: true
    },
    ExponentPushToken: {
        type: String,
        require: true
    },
})

const Chat_Channel = mongoose.model('Chat_Channel', chat_channelSchema);

module.exports = Chat_Channel;