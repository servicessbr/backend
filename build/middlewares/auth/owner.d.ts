import { Request, Response, NextFunction } from 'express';
declare const owner: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default owner;
