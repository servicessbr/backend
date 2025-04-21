import { Request, Response, NextFunction } from 'express';

const convertEmail = (req: Request, res: Response, next: NextFunction) => {
    /* 
        * Converte o email que vem dos "params" para "locals" 
    */
    const { email } = req.params;

    //@ts-ignore
    req.email = email;
    next();
}

export default convertEmail;