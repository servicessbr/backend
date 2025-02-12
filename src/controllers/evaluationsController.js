
const { QueryTypes } = require('sequelize');

const Evaluations = require("../models/Evaluations");

const evaluationsController = {
    async list(req, res) {

        const { provider_professional_uid } = req.params;

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

module.exports = evaluationsController;
