import { Request, Response } from 'express';

function end(req:Request, res:Response) {
    return res.status(200).end();
}

export default end;