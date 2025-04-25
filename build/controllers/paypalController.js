"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Users_1 = __importDefault(require("../models/Users"));
const console_1 = require("console");
const isJson_1 = __importDefault(require("../functions/isJson"));
const paymentsControllers_1 = __importDefault(require("./paymentsControllers"));
const URL_1 = require("../configs/constants/URL");
const priceTags_1 = require("../configs/constants/priceTags");
const redisConfig_1 = require("../configs/cache/redisConfig");
const CANCEL_URL = `${URL_1.URL_REACT_CLIENT}/payment/finish`;
const RETURN_URL = `${URL_1.URL_REACT_CLIENT}/paypal/checkout`;
async function generateAccessToken() {
    const response = await (0, axios_1.default)(`${URL_1.URL_PAYPAL_BASE}/v1/oauth2/token`, {
        url: `${URL_1.URL_PAYPAL_BASE}/v1/oauth2/token`,
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })
        .catch((err) => (0, console_1.error)(err));
    if (!(response && response.data))
        return false;
    return response.data.access_token;
}
const paypalController = {
    async generatePaypal(req, res) {
        //@ts-ignore
        const payer_customer_uid = req.uid;
        const { transaction_amount, provider_professional_uid, execution_date, original_subwork_title } = req.body;
        /*
              * Schema Validation -> Joi
          */
        if (!(transaction_amount &&
            typeof transaction_amount === 'number' &&
            transaction_amount >= priceTags_1.MIN_PAYMENT_X &&
            payer_customer_uid && provider_professional_uid &&
            execution_date &&
            original_subwork_title))
            return res
                .status(400)
                .json({ message: 'paypal error - missing data' })
                .end();
        const description = `Contratação do serviço: "${original_subwork_title}"`;
        const accessToken = await generateAccessToken();
        const response = await (0, axios_1.default)({
            url: URL_1.URL_PAYPAL_BASE + '/v2/checkout/orders',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: [
                            {
                                name: 'Contratação',
                                description,
                                quantity: 1,
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: transaction_amount
                                }
                            }
                        ],
                        amount: {
                            currency_code: 'USD',
                            value: transaction_amount,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: transaction_amount
                                }
                            }
                        }
                    }
                ],
                application_context: {
                    return_url: RETURN_URL,
                    cancel_url: CANCEL_URL,
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'Servicess'
                }
            })
        })
            .catch((err) => console.error(err));
        if (!(response && response.data && response.data.links))
            return res.status(500).end();
        console.log('response.data: ', response.data);
        const url = response.data.links.find((link) => link.rel === 'approve').href;
        //@ts-ignore
        const users = await Users_1.default.findAll({
            raw: true,
            where: { uid: [payer_customer_uid, provider_professional_uid] },
            attributes: ['email', 'name', 'uid']
        })
            .catch((err) => (0, console_1.error)(err));
        if (!users)
            return res.status(500).end();
        const user = users.filter((u) => u.uid === payer_customer_uid)[0];
        const prof = users.filter((u) => u.uid === provider_professional_uid)[0];
        console.log(users, user, prof);
        //@ts-ignore
        if (!(user && user.email && user.name && prof && prof.email && prof.name))
            return res
                .status(400)
                .json({ message: 'payment error - cant get payer customer and prof data' })
                .end();
        console.log(url.indexOf('token=') + 6, url.length);
        return await (0, redisConfig_1.setCache)(`paypal_payment:${url.slice(url.indexOf('token=') + 6, url.length)}`, JSON.stringify({
            payer_customer_uid,
            //@ts-ignore
            payer_customer_name: user.name,
            //@ts-ignore
            payer_customer_email: user.email,
            provider_professional_uid,
            //@ts-ignore
            provider_professional_name: prof.name,
            //@ts-ignore
            provider_professional_email: prof.email,
            execution_date,
            transaction_amount,
            original_subwork_title
        }))
            .then(() => res.status(200).json({ url }).end())
            .catch((err) => res.status(500).end());
    },
    async checkoutPayPal(req, res) {
        //const orderId = req.query.token;
        const { orderId, PayerID } = req.body;
        const redisKey = `paypal_payment:${orderId}`;
        let data = await (0, redisConfig_1.getCache)(redisKey);
        if (!(0, isJson_1.default)(data))
            return res
                .status(400)
                .json({ message: 'make paypal erro - schema format' })
                .end();
        //@ts-ignore
        data = JSON.parse(data);
        const accessToken = await generateAccessToken();
        console.log('req.query.token', orderId, PayerID, data);
        const response = await (0, axios_1.default)({
            url: URL_1.URL_PAYPAL_BASE + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })
            .catch((err) => console.error(err));
        if (!(response && response.data && response.data.links))
            return res.status(204).end();
        console.log('DATA: ', response.data && response.data.status);
        if (response.data && response.data.status === 'COMPLETED') {
            return (0, paymentsControllers_1.default)(res, data, redisKey);
        }
        else
            return res.status(204).end();
    }
};
exports.default = paypalController;
