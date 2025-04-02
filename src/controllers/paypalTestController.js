const { default: test } = require("node:test");
//const { createPaypalOrder } = require("../functions/paypal");
const axios = require('axios');

const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com';
const BASE_URL = 'http://localhost:8000';

async function generateAccessToken() {
    const response = await axios({
        url: `${PAYPAL_BASE_URL}/v1/oauth2/token`,
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    }).catch(err => console.error(err))

    return response.data.access_token;
}


const paypalTestController = {
    async createPaypalOrder(req, res) {
        const { value } = req.body;

        const accessToken = await generateAccessToken()

        const response = await axios({
            url: PAYPAL_BASE_URL + '/v2/checkout/orders',
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
                                name: `Plano Servicess PRO @${''}`,
                                description: `Plano Servicess PRO @${''}`,
                                quantity: 1,
                                unit_amount: {
                                    currency_code: 'USD',
                                    value
                                }
                            }
                        ],

                        amount: {
                            currency_code: 'USD',
                            value,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value
                                }
                            }
                        }
                    }
                ],

                application_context: {
                    return_url: BASE_URL + '/paypal/checkout',
                    cancel_url: BASE_URL + '/paypal/checkout',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'Servicess'
                }
            })
        })

        const url = response.data.links.find(link => link.rel === 'approve').href
        return res.status(200).json({ url }).end();
    },

    async checkoutPayPal(req, res) {

        const orderId = req.query.token;

        const accessToken = await generateAccessToken();

        console.log('req.query.token', orderId);

        const response = await axios({
            url: PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })

        console.log(response.data);

        return res.status(200).end();
    }
}

module.exports = paypalTestController;