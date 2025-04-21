import { QueryTypes } from 'sequelize';
import { error } from 'console';
import { Request, Response } from 'express';

/*
    * Models:
*/
import Works from '../models/Works';

const tmpController = {
    async premium(req:Request, res:Response) {
        //@ts-ignore
        await Works.sequelize.query(
            `SELECT 
            DISTINCT ON (users.uid) 
            works.id, works.title, works.discount, works.banner,
            works.price, works.description, cities.name as city, 
            users.uid, users.name, users.verified,users.profession 
            FROM works
            INNER JOIN users
            ON (works.user_uid = users.uid)
            INNER JOIN cities 
            ON (works.city_id = cities.id) 
            LEFT JOIN premiums 
            ON (works.user_uid = premiums.user_uid) 
            WHERE (premiums.expiration > now())
            LIMIT 9;`,
            {
                type: QueryTypes.SELECT
            }
        )
            .then((list:any) => res.status(200).json(list))
            .catch((err:Error) => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'premium list cards error' })
            })
    }
}

export default tmpController