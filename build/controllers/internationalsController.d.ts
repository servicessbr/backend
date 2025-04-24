import { Request, Response } from 'express';
declare const internationalsController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default internationalsController;
