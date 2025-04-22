import { Request, Response } from 'express';
declare const usersController: {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<void>;
    load(req: Request, res: Response): Promise<void>;
    updates: {
        password(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    };
};
export default usersController;
