import { Request, Response } from 'express';
declare const locationsController: {
    list(req: Request, res: Response): Promise<void>;
};
export default locationsController;
