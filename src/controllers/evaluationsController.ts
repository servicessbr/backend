
import { QueryTypes } from 'sequelize';

import Evaluations from "../models/Evaluations";
import { Request, Response } from 'express';

const evaluationsController = {
    async list(req: Request, res: Response) {

        //@ts-ignore
        const { provider_professional_uid } = req.params;

        //@ts-ignore
        const list = await Evaluations.sequelize.query(
            `SELECT DISTINCT ON (o.payer_customer_uid) e.id, e.stars, e.review_description, 
            o.payer_customer_uid, o.provider_professional_uid, 
            u.name as payer_customer_name
            FROM evaluations as e
            LEFT JOIN orders as o
            ON (e.id = o.id)
            LEFT JOIN users as u
            ON (o.payer_customer_uid = u.uid)
            WHERE (o.provider_professional_uid = :provider_professional_uid)
            LIMIT 6;`,
            {
                replacements: { provider_professional_uid },
                type: QueryTypes.SELECT
            }
        )

        return res.status(200).json(list).end();
    }
}

export default evaluationsController;
