const { QueryTypes } = require('sequelize');
const { error } = require('console')

/*
    * Models:
*/
const Works = require('../models/Works');

const tmpController = {
    async premium(req, res) {
        await Works.sequelize.query(
            `SELECT 
            DISTINCT ON (users.uid) 
            works.id, works.title, works.discount, works.banner,
            works.price, works.description, cities.name as city, 
            users.uid, users.name, users.verified,users.profession, 
            users.avatar 
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
            .then(list => res.status(200).json(list))
            .catch(err => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'premium list cards error' })
            })
    }
}

module.exports = tmpController