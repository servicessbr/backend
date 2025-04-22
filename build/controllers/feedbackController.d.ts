import { Request, Response } from 'express';
declare const feedbackController: {
    make(req: Request, res: Response): Promise<void>;
};
export default feedbackController;
