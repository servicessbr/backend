import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
declare const authorization: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default authorization;
