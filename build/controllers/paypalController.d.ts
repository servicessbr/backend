import { Request, Response } from 'express';
declare const paypalController: {
    generatePaypal(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    checkoutPayPal(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default paypalController;
