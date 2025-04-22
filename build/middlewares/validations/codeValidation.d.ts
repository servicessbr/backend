import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
declare const codeValidation: {
    utoken(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    newUser(req: Request, res: Response, next: NextFunction): Promise<void>;
};
export default codeValidation;
