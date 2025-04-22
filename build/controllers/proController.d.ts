import { Request, Response } from 'express';
declare const proController: {
    isPro(req: Request, res: Response): Response<any, Record<string, any>>;
};
export default proController;
