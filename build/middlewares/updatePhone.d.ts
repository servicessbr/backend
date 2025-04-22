import { Request, Response, NextFunction } from 'express';
declare function updatePhone(req: Request, res: Response, next: NextFunction): Promise<void>;
export default updatePhone;
