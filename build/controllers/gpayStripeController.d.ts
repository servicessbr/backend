import { Request, Response } from "express";
declare const gpayStripeController: {
    intent(req: Request, res: Response): Promise<void>;
    process(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    confirm(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default gpayStripeController;
