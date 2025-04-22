import mongoose from 'mongoose';
declare const Conversation: mongoose.Model<{
    users: string[];
    inBox: boolean[];
    messages: {
        date?: Date | undefined;
        text?: string | undefined;
        author?: string | undefined;
        time?: string | undefined;
    }[];
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    users: string[];
    inBox: boolean[];
    messages: {
        date?: Date | undefined;
        text?: string | undefined;
        author?: string | undefined;
        time?: string | undefined;
    }[];
}>>;
export default Conversation;
