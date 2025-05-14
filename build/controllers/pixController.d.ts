import 'dotenv/config';
import { Request, Response } from 'express';
declare const pixController: {
    generate(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    status(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default pixController;
