import { Request, Response, NextFunction } from 'express';
declare const convertEmail: (req: Request, res: Response, next: NextFunction) => void;
export default convertEmail;
