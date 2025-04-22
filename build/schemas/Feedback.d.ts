import mongoose from 'mongoose';
declare const Feedback: mongoose.Model<{
    uid?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    code?: string | undefined;
    suggestion?: string | undefined;
    evaluation?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    uid?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    code?: string | undefined;
    suggestion?: string | undefined;
    evaluation?: string | undefined;
}>>;
export default Feedback;
