import 'dotenv/config';
import { Response } from 'express';
export declare const createOrder: (res: Response, data: any, removeRadisKey: string) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const makePro: (res: Response, user_uid: string, transaction: {
    id: string;
    date_approved: Date;
    amount: number;
    email: string;
    name: string;
}) => Promise<void>;
