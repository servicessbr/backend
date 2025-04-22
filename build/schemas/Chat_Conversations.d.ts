import mongoose from 'mongoose';
declare const Chat_Conversation: mongoose.Model<{
    messages: {
        date: Date;
        deleted: boolean;
        text?: string | undefined;
        time?: string | undefined;
        author_number?: number | undefined;
    }[];
    user?: {
        author_number: number;
        uid?: string | undefined;
    } | undefined;
    conv_id?: {
        uid?: string | undefined;
    } | undefined;
    receivar?: {
        author_number: number;
        uid?: string | undefined;
    } | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    messages: {
        date: Date;
        deleted: boolean;
        text?: string | undefined;
        time?: string | undefined;
        author_number?: number | undefined;
    }[];
    user?: {
        author_number: number;
        uid?: string | undefined;
    } | undefined;
    conv_id?: {
        uid?: string | undefined;
    } | undefined;
    receivar?: {
        author_number: number;
        uid?: string | undefined;
    } | undefined;
}>>;
export default Chat_Conversation;
