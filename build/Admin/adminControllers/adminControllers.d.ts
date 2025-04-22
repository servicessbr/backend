import { Request, Response, NextFunction } from 'express';
declare const adminControllers: {
    login(req: Request, res: Response): Promise<void>;
    countUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createNewUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    newExtendedCode(req: Request, res: Response, next: NextFunction): Promise<void>;
};
export default adminControllers;
