import { Request, Response } from 'express';
declare const worksController: {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    load(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<void>;
};
export default worksController;
