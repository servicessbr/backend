import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
declare const generateCode: {
    utoken(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    newUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
};
export default generateCode;
