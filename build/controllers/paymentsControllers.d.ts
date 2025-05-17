import 'dotenv/config';
import { Response } from 'express';
export declare const makePro: (res: Response, user_uid: string, transaction: {
    id: string;
    date_approved: Date;
    amount: number;
    email: string;
    name: string;
}) => Promise<void>;
