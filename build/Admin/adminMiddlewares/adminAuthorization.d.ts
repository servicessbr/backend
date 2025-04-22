import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
declare const adminAuthorization: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default adminAuthorization;
