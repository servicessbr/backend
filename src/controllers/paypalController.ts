import axios from 'axios';
import { error } from "console";
import isJson from "../functions/isJson";
import { makePro } from "./paymentsControllers";
import { Request, Response } from 'express';
import { URL_PAYPAL_BASE, URL_REACT_CLIENT } from '../configs/constants/URL';

import { getCache, setCache } from '../configs/cache/redisConfig';
import PlanAndPrice from '../functions/PlanAndPrice';



async function generateAccessToken() {
    const response = await axios.post(`${URL_PAYPAL_BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: process.env.PAYPAL_CLIENT_ID as string,
            password: process.env.PAYPAL_SECRET as string
        },
    });

    return response.data.access_token;
}


const paypalController = {

    async create_order(req: Request, res: Response) {
        //console.log('in!')
        //@ts-ignore
        const uid = req.uid;
        //@ts-ignore
        const email = req.email;

        //@ts-ignore
        if (!(email && uid)) return res
            .status(400)
            .json({ message: 'payment pro error - cant get payer customer data' })
            .end();

        const { plan } = req.body;

        const PLAN = PlanAndPrice(plan);

        if (!PLAN) return res
            .status(400)
            .json({ message: 'payment pro error - not a valid plan' })
            .end();

        const PRICE = PLAN.price;

        const CANCEL_URL = `${URL_REACT_CLIENT}/work/create`;
        const RETURN_URL = `${URL_REACT_CLIENT}/paypal/checkout/pro`;

        const description =
            `Plano Servicess PRO @${uid}`;

        try {
            const accessToken = await generateAccessToken();

            const response = await axios
                .post(`${URL_PAYPAL_BASE}/v2/checkout/orders`, {
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            items: [
                                {
                                    name: 'PRO subscription plan',
                                    description,
                                    quantity: 1,
                                    unit_amount: {
                                        currency_code: 'BRL',
                                        value: PRICE
                                    }
                                }
                            ],

                            amount: {
                                currency_code: 'BRL',
                                value: PRICE,
                                breakdown: {
                                    item_total: {
                                        currency_code: 'BRL',
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
                        brand_name: 'Servicess LTDA'
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

            if (!response?.data?.id) return res.status(500).end();
            //console.log('response.data: ', response.data)

            await setCache(
                `paypal_pro:${response.data.id}`,
                JSON.stringify({
                    uid, email, price: PRICE
                })
            )

            res.json({ id: response.data.id });
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao criar ordem');
        }
    },

    async capture(req: Request, res: Response) {
        //console.log('in! capture!')
        //const orderId = req.query.token;
        const { orderId } = req.body;

        //const accessToken = await generateAccessToken();

        //console.log('1 - orderId: ', orderId);
        /*
        const response = await axios({
            url: URL_PAYPAL_BASE + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })
            .catch((err: Error) => error(err));

        console.log('2.1 - response.data: ', response)

        if (!(response && response.data && response.data.links)) return res.status(204).end();

        console.log('2.2 - response.data: ', response.data && response.data.status);
        */

        const redisKey = `paypal_pro:${orderId}`

        let getData = await getCache(redisKey);


        if (!isJson(getData)) {
            let message = 'make paypal erro - schema format';
            error(message);
            return res
                .status(400)
                .json({ message })
                .end();
        }

        const data = JSON.parse(`${getData}`);

        //console.log('3 - cache data: ', data)

        if (!(data?.uid && data?.email)) {
            let message = 'paypal pro error - missing data';
            error(message);
            return res
                .status(400)
                .json({ message })
                .end();
        }

        //console.log('4 - uid & email', data?.uid, data?.email);

        /*if (response.data && response.data.status === 'COMPLETED') {*/
        if (true) {
            //console.log('5 - COMPLETED');

            return await makePro(
                res,
                data.uid,
                {
                    email: data.email,
                    id: orderId,
                    //date_approved: response.data.date_approved,
                    date_approved: new Date(),
                    amount: data.price,
                    name: ''
                }
            )
        } else return res.status(204).end();

    }

}

export default paypalController;