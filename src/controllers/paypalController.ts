

import axios from 'axios';
import Users from "../models/Users";
import { error } from "console";
import isJson from "../functions/isJson";
import { createOrder, makePro } from "./paymentsControllers";
import { Request, Response } from 'express';
import { URL_PAYPAL_BASE, URL_REACT_CLIENT } from '../configs/constants/URL';
import { MIN_PAYMENT_X, PRICE } from '../configs/constants/priceTags';
import { getCache, setCache } from '../configs/cache/redisConfig';



async function generateAccessToken(): Promise<string | false> {
    const response = await axios(`${URL_PAYPAL_BASE}/v1/oauth2/token`, {
        url: `${URL_PAYPAL_BASE}/v1/oauth2/token`,
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID as string,
            password: process.env.PAYPAL_SECRET as string
        }
    })
        .catch((err: Error) => error(err))

    if (!(response && response.data)) return false;
    return response.data.access_token;
}


const paypalController = {
    orders: {
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

            const CANCEL_URL = `${URL_REACT_CLIENT}/payment/methods`;
            const RETURN_URL = `${URL_REACT_CLIENT}/paypal/checkout/pro`;

            const description =
                `Contratação do serviço: "${original_subwork_title}"`;

            const accessToken = await generateAccessToken();

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
                        brand_name: 'Servicess LTDA'
                    }
                })
            })
                .catch((err: Error) => console.error(err))

            if (!(response && response.data && response.data.links)) return res.status(500).end();
            console.log('response.data: ', response.data)


            const url = response.data.links.find((link: { rel: string }) => link.rel === 'approve').href;

            //@ts-ignore
            const users = await Users.findAll({
                raw: true,
                where: { uid: [payer_customer_uid, provider_professional_uid] },
                attributes: ['email', 'name', 'uid']
            })
                .catch((err: Error) => error(err));

            if (!users) return res.status(500).end();
            const user = users.filter((u: any) => u.uid === payer_customer_uid)[0];

            const prof = users.filter((u: any) => u.uid === provider_professional_uid)[0];

            console.log(users, user, prof);
            //@ts-ignore
            if (!(user && user.email && user.name && prof && prof.email && prof.name)) return res
                .status(400)
                .json({ message: 'payment error - cant get payer customer and prof data' })
                .end();

            console.log(url.indexOf('token=') + 6, url.length);

            return await setCache(
                `paypal_payment:${url.slice(url.indexOf('token=') + 6, url.length)}`,
                JSON.stringify({
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
                })
            )
                .then(() => res.status(200).json({ url }).end())
                .catch((err: Error) => {
                    error(err);
                    return res.status(500).end();
                });

        },

        async checkoutPayPal(req: Request, res: Response) {

            //const orderId = req.query.token;
            const { orderId, PayerID } = req.body;

            const redisKey = `paypal_payment:${orderId}`

            let getData = await getCache(redisKey);

            if (!isJson(getData)) return res
                .status(400)
                .json({ message: 'make paypal erro - schema format' })
                .end();


            const data = JSON.parse(`${getData}`);

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


            if (!(response && response.data && response.data.links)) return res.status(204).end();
            console.log('DATA: ', response.data && response.data.status);


            if (response.data && response.data.status === 'COMPLETED') {
                return await createOrder(res, data, redisKey);
            } else return res.status(204).end();

        }
    },
    pro: {
        async generatePp(req: Request, res: Response) {
            //@ts-ignore
            const uid = req.uid;
            //@ts-ignore
            const pro = req.pro;
            //@ts-ignore
            const email = req.email;

   

            //@ts-ignore
            if (!(email && uid)) return res
                .status(400)
                .json({ message: 'payment pro error - cant get payer customer data' })
                .end();

            const CANCEL_URL = `${URL_REACT_CLIENT}/work/create`;
            const RETURN_URL = `${URL_REACT_CLIENT}/paypal/checkout/pro`;

            const description =
                `Plano Servicess PRO @${uid}`;

            const accessToken = await generateAccessToken();

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
                .catch((err: Error) => console.error(err));

            if (!(response && response.data && response.data.links)) return res.status(500).end();
            console.log('response.data: ', response.data)


            const url = response.data.links.find((link: { rel: string }) => link.rel === 'approve').href;

            return await setCache(
                `paypal_pro:${url.slice(url.indexOf('token=') + 6, url.length)}`,
                JSON.stringify({
                    uid, email
                })
            )
                .then(() => res.status(200).json({ url }).end())
                .catch((err: Error) => {
                    error(err);
                    return res.status(500).end();
                }
                );
        },
        async checkoutPp(req: Request, res: Response) {

            //const orderId = req.query.token;
            const { orderId, PayerID } = req.body;

            const redisKey = `paypal_pro:${orderId}`

            let getData = await getCache(redisKey);


            if (!isJson(getData)) return res
                .status(400)
                .json({ message: 'make paypal erro - schema format' })
                .end();

            const data = JSON.parse(`${getData}`);

            if (!(data?.uid && data?.email)) return res
            .status(400)
            .json({ message: 'paypal pro error - missing data' })
            .end();

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

            if (!(response && response.data && response.data.links)) return res.status(204).end();
            console.log('DATA: ', response.data && response.data.status);

            if (response.data && response.data.status === 'COMPLETED') {
                return await makePro(
                    res,
                    data.uid,
                    {
                        email: data.email,
                        id: orderId,
                        date_approved: response.data.date_approved,
                        amount: PRICE,
                        name: PayerID
                    }
                )
            } else return res.status(204).end();

        }
    }
}

export default paypalController;