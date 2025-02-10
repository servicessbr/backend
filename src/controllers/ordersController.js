const { QueryTypes } = require('sequelize');
const Evaluations = require("../models/Evaluations");
const Orders = require("../models/Orders");

const ordersController = {

    async list(req, res) {
        const uid = req.uid;

        const customersList = await Orders.sequelize.query(
            `SELECT orders.*, users.name 
                FROM orders
                LEFT JOIN users
                ON (users.uid = orders.payer_customer_uid)
                WHERE (
                    orders.provider_professional_uid = :provider_professional_uid
                    AND status = 'in_progress'
                );`,
            {
                replacements: { provider_professional_uid: uid },
                type: QueryTypes.SELECT
            }
        ).catch(err => console.error(err));

        const professionalsList = await Orders.sequelize.query(
            `SELECT orders.*, users.profession 
                FROM orders
                LEFT JOIN users
                ON (users.uid = orders.provider_professional_uid)
                WHERE (
                    orders.payer_customer_uid = :payer_customer_uid
                    AND status = 'in_progress'
                );`,
            {
                replacements: { payer_customer_uid: uid },
                type: QueryTypes.SELECT
            }
        ).catch(err => console.error(err));

        return res.status(200).json([professionalsList, customersList]).end();
    },

    async finalizeAndEvaluate(req, res) {
        const uid = req.uid;
        const { order_id } = req.params;
        const {
            stars, review_description
        } = req.body;

        if (!(uid && order_id))
            return res
                .status(400)
                .json({ message: 'finalize & evaluate error - data schema' })
                .end()

        await Orders.update(
            { status: 'finished' },
            {
                where: {
                    id: order_id,
                    payer_customer_uid: uid
                },
            }
        ).then(async response => {
            console.log(response)

            if (!(
                stars &&
                typeof stars === 'number' &&
                stars >= 1 && stars <= 5
            )) return res
                .status(204)
                .json({ message: 'no review, no stars' })
                .end();

            await Evaluations.create({
                id: order_id,
                stars, review_description
            })

            return res.status(200).end();
        })
    }
};

module.exports = ordersController;