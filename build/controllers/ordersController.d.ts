import { Request, Response } from 'express';
declare const ordersController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    finalizeAndEvaluate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default ordersController;
