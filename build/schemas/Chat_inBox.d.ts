import mongoose from 'mongoose';
declare const Chat_inBox: mongoose.Model<{
    senders_list: {
        amount: number;
        sender_uid?: string | undefined;
        last_text?: string | undefined;
    }[];
    users_uid?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    senders_list: {
        amount: number;
        sender_uid?: string | undefined;
        last_text?: string | undefined;
    }[];
    users_uid?: string | undefined;
}>>;
export default Chat_inBox;
