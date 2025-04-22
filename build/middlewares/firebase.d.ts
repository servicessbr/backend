import { Request, Response } from 'express';
declare const firebase: {
    avatar: {
        update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
        delete(req: Request, res: Response): Promise<void>;
    };
    deleteAll(req: Request, res: Response): Promise<void>;
};
export default firebase;
