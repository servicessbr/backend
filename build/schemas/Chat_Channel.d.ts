import mongoose from 'mongoose';
declare const Chat_Channel: mongoose.Model<{
    uid?: string | undefined;
    ExponentPushToken?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    uid?: string | undefined;
    ExponentPushToken?: string | undefined;
}>>;
export default Chat_Channel;
