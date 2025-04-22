import 'dotenv/config';
import { Response } from 'express';
declare const createOrder: (res: Response, data: any, removeRadisKey: string) => Promise<Response<any, Record<string, any>> | undefined>;
export default createOrder;
