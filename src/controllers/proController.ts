import { Request, Response } from 'express';

const proController = {
    isPro(req:Request, res:Response) {
        //@ts-ignore
        const pro = req.pro;

        return res.status(200).json({ isPro: pro }).end();

        // Liberado para todos:
        //return res.status(200).json({ isPro: true }).end();
    }
}

export default proController;