import { Request, Response } from 'express';
declare const cardsController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    belongs(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default cardsController;
