import mongoose from 'mongoose';

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

export default Chat_Channel;