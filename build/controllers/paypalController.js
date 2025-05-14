"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const console_1 = require("console");
const isJson_1 = __importDefault(require("../functions/isJson"));
const paymentsControllers_1 = require("./paymentsControllers");
const URL_1 = require("../configs/constants/URL");
const redisConfig_1 = require("../configs/cache/redisConfig");
const PlanAndPrice_1 = __importDefault(require("../functions/PlanAndPrice"));
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
    async generatePp(req, res) {
        //@ts-ignore
        const uid = req.uid;
        //@ts-ignore
        const email = req.email;
        //@ts-ignore
        if (!(email && uid))
            return res
                .status(400)
                .json({ message: 'payment pro error - cant get payer customer data' })
                .end();
        const { plan } = req.params;
        const PLAN = (0, PlanAndPrice_1.default)(plan);
        if (!PLAN)
            return res
                .status(400)
                .json({ message: 'payment pro error - not a valid plan' })
                .end();
        const PRICE = PLAN.price;
        const CANCEL_URL = `${URL_1.URL_REACT_CLIENT}/work/create`;
        const RETURN_URL = `${URL_1.URL_REACT_CLIENT}/paypal/checkout/pro`;
        const description = `Plano Servicess PRO @${uid}`;
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
                                name: 'Plano PRO',
                                description,
                                quantity: 1,
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: PRICE
                                }
                            }
                        ],
                        amount: {
                            currency_code: 'USD',
                            value: PRICE,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: PRICE
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
                    brand_name: 'Servicess LTDA'
                }
            })
        })
            .catch((err) => console.error(err));
        if (!(response && response.data && response.data.links))
            return res.status(500).end();
        console.log('response.data: ', response.data);
        const url = response.data.links.find((link) => link.rel === 'approve').href;
        return await (0, redisConfig_1.setCache)(`paypal_pro:${url.slice(url.indexOf('token=') + 6, url.length)}`, JSON.stringify({
            uid, email, price: PRICE
        }))
            .then(() => res.status(200).json({ url }).end())
            .catch((err) => {
            (0, console_1.error)(err);
            return res.status(500).end();
        });
    },
    async checkoutPp(req, res) {
        //const orderId = req.query.token;
        const { orderId, PayerID } = req.body;
        const redisKey = `paypal_pro:${orderId}`;
        let getData = await (0, redisConfig_1.getCache)(redisKey);
        if (!(0, isJson_1.default)(getData))
            return res
                .status(400)
                .json({ message: 'make paypal erro - schema format' })
                .end();
        const data = JSON.parse(`${getData}`);
        if (!(data?.uid && data?.email))
            return res
                .status(400)
                .json({ message: 'paypal pro error - missing data' })
                .end();
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
            return await (0, paymentsControllers_1.makePro)(res, data.uid, {
                email: data.email,
                id: orderId,
                date_approved: response.data.date_approved,
                amount: data.price,
                name: PayerID
            });
        }
        else
            return res.status(204).end();
    }
};
exports.default = paypalController;
