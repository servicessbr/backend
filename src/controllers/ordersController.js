const Orders = require("../models/Orders");

const ordersController = {
    async listPayerCustomer(req, res) {
        const { provider_professional_uid } = req.params;

        const customersList = await Orders.findAll({
            where: {
                provider_professional_uid,
                status: 'in_progesss'
            }
        })

        return res.status(200).json(customersList).end();
    },

    async listProviderProfessional(req, res) {
        const { payer_customer_uid } = req.params;

        const professionalsList = await Orders.findAll({
            where: {
                payer_customer_uid,
                status: 'in_progesss'
            }
        })

        return res.status(200).json(professionalsList).end();
    }
};

module.exports = ordersController;