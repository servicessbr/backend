import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    users: [String],
    inBox: {
        type: [Boolean],
        required: true,
        default: [false, false]
    },
    messages: [
        {
            text: {
                type: String,
                require: true
            },
            author: {
                type: String,
                require: true
            },
            time: {
                type: String,
                require: true
            },
            date: {
                type: Date,
                require: true
            }
        }
    ]
})

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;