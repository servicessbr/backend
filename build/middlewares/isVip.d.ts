import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
export default function isVip(req: Request, res: Response, next: NextFunction): Promise<void>;
