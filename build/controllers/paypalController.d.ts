import { Request, Response } from 'express';
declare const paypalController: {
    generatePp(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    checkoutPp(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
};
export default paypalController;
