import { Request, Response } from 'express';

/* 
    * Models:
*/
import Cities from '../models/Cities';

const locationsController = {
    async list(req:Request, res:Response) {

        const { location } = req.params;

        //@ts-ignore
        await Cities.findAll({
            attributes: ['name', 'id'],
            where: { state_id: location }
        })
            .then((data) => res.status(200).json(data))
            .catch((e) => {
                console.error(e);
                return res.status(500).json({ message: 'list cities error' });
            });
    }

}

export default locationsController;
