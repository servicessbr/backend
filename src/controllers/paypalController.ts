

import axios from 'axios';
import Users from "../models/Users";
import { error } from "console";
import isJson from "../functions/isJson";
import createOrder from "./paymentsControllers";
import { Request, Response } from 'express';
import { URL_PAYPAL_BASE, URL_REACT_CLIENT } from '../configs/constants/URL';
import { MIN_PAYMENT_X } from '../configs/constants/priceTags';
import { getCache, setCache } from '../configs/cache/redisConfig';

const CANCEL_URL = `${URL_REACT_CLIENT}/payment/finish`;
const RETURN_URL = `${URL_REACT_CLIENT}/paypal/checkout`;

async function generateAccessToken() {
    const response = await axios(JSON.stringify({
        url: `${URL_PAYPAL_BASE}/v1/oauth2/token`,
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })).catch((err: Error) => console.error(err))

    //@ts-ignore
    return response.data.access_token;
}


const paypalController = {
    async generatePaypal(req: Request, res: Response) {
        //@ts-ignore
        const payer_customer_uid = req.uid;

        const {
            transaction_amount,
            provider_professional_uid,
            execution_date,
            original_subwork_title
        }: any = req.body;

        /*
              * Schema Validation -> Joi
          */
        if (!(
            transaction_amount &&
            typeof transaction_amount === 'number' &&
            transaction_amount >= MIN_PAYMENT_X &&

            payer_customer_uid && provider_professional_uid &&
            execution_date &&
            original_subwork_title
        )) return res
            .status(400)
            .json({ message: 'paypal error - missing data' })
            .end();

        const description =
            `Contratação do serviço: "${original_subwork_title}"`;

        const accessToken = await generateAccessToken()

        const response = await axios({
            url: URL_PAYPAL_BASE + '/v2/checkout/orders',
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
            .catch((err: Error) => console.error(err))

        //@ts-ignore
        console.log('response.data: ', response.data)

        //@ts-ignore
        const url = response.data.links.find(link => link.rel === 'approve').href;

        //@ts-ignore
        const users = await Users.findAll({
            raw: true,
            where: { uid: [payer_customer_uid, provider_professional_uid] },
            attributes: ['email', 'name', 'uid']
        })
            .catch((err: Error) => error(err));

        //@ts-ignore
        const user = users.filter(u => u.uid === payer_customer_uid)[0];
        //@ts-ignore
        const prof = users.filter(u => u.uid === provider_professional_uid)[0];

        console.log(users, user, prof);

        if (!(user && user.email && user.name && prof && prof.email && prof.name)) return res
            .status(400)
            .json({ message: 'payment error - cant get payer customer and prof data' })
            .end();

        console.log(url.indexOf('token=') + 6, url.length);

        return await setCache(
            `paypal_payment:${url.slice(url.indexOf('token=') + 6, url.length)}`,
            JSON.stringify({
                payer_customer_uid,
                payer_customer_name: user.name,
                payer_customer_email: user.email,
                provider_professional_uid,
                provider_professional_name: prof.name,
                provider_professional_email: prof.email,
                execution_date,
                transaction_amount,
                original_subwork_title
            })
        )
            .then(() => res.status(200).json({ url }).end())
            .catch((err: Error) => res.status(500).end());

    },

    async checkoutPayPal(req: Request, res: Response) {

        //const orderId = req.query.token;
        const { orderId, PayerID } = req.body;

        const redisKey = `paypal_payment:${orderId}`

        let data = await getCache(redisKey);

        //@ts-ignore
        if (!isJson(data)) return res
            .status(400)
            .json({ message: 'make paypal erro - schema format' })
            .end();


        //@ts-ignore
        data = JSON.parse(data);

        const accessToken = await generateAccessToken();

        console.log('req.query.token', orderId, PayerID, data);

        const response = await axios({
            url: URL_PAYPAL_BASE + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })
            .catch((err: Error) => console.error(err));

        //@ts-ignore
        console.log('DATA: ', response.data && response.data.status);

        //@ts-ignore
        if (response.data && response.data.status === 'COMPLETED') {
            return createOrder(res, data, redisKey);
        } else return res.status(204).end();

    }
}

export default paypalController;