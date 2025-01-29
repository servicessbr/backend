const Evaluations = require("../models/Evaluations");
const Orders = require("../models/Orders");

const ordersController = {
    list: {
        async payerCustomer(req, res) {
            const uid = req.uid;
            console.log(uid);

            const customersList = await Orders.findAll({
                where: {
                    provider_professional_uid: uid,
                    status: 'in_progress'
                }
            })

            return res.status(200).json(customersList).end();
        },

        async providerProfessional(req, res) {
            const uid = req.uid;
            console.log(uid);

            const professionalsList = await Orders.findAll({
                where: {
                    payer_customer_uid: uid,
                    status: 'in_progress'
                }
            })

            return res.status(200).json(professionalsList).end();
        }
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