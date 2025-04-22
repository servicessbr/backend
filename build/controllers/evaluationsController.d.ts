import { Request, Response } from 'express';
declare const evaluationsController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default evaluationsController;
