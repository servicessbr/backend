import 'dotenv/config';
import { Request, Response } from 'express';
declare const pixController: {
    orders: {
        generatePayment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | "payment error - cpf format">;
        getStatusAndMakeOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    };
    pro: {
        generate(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
        status(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    };
};
export default pixController;
