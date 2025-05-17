import { Request, Response } from 'express';
declare const paypalController: {
    create_order(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    capture(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
};
export default paypalController;
