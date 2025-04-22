import { Request, Response } from 'express';
declare const emailController: {
    newUser(req: Request, res: Response): void;
    utoken(req: Request, res: Response): void;
};
export default emailController;
