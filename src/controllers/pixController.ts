import 'dotenv/config';

import { error } from 'console';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Users from '../models/Users';
import { Request, Response } from 'express';

/*
    * Models
*/
import isJson from '../functions/isJson';
import transporter from '../email/transporter';
import voucherOptions from '../email/options/voucherOptions';
import cpf from '../functions/cpf';

import { makePro } from './paymentsControllers';
import { URL_MERCADO_PAGO } from '../configs/constants/URL';

import HEROKU_APP_NAME from '../configs/constants/heroku_app_name';
import { getCache, setCache } from '../configs/cache/redisConfig';
import PlanAndPrice from '../functions/PlanAndPrice';

const resourceX = (id: any) => `${URL_MERCADO_PAGO}/v1/payments/${id}`;

const api = axios.create({
    baseURL: URL_MERCADO_PAGO
});

api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
    return config;
});


const pixController = {
    async generate(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid;

        const { plan } = req.params;

        const PLAN = PlanAndPrice(plan);

        if (!PLAN) return res
            .status(400)
            .json({ message: 'payment pro error - not a valid plan' })
            .end();

        //@ts-ignore
        const user = await Users.findOne({
            where: { uid },
            attributes: ['email', 'name']
        })
            .catch((err: Error) => error(err));

        //@ts-ignore
        if (!(user && user.email && user.name)) return res
            .status(400)
            .json({ message: 'payment pro error - cant get payer customer data' })
            .end();

        //@ts-ignore
        const { email } = user;
        const first_name =
            //@ts-ignore
            user.name
                //@ts-ignore
                .slice(0, user.name.indexOf(' '))
                .trim();
        const last_name =
            //@ts-ignore
            user.name
                //@ts-ignore
                .slice(user.name.indexOf(' '), user.name.length)
                .trim();
        const description =
            `Plano Servicess PRO @${uid}`;

        const body = {
            transaction_amount: PLAN.price,
            description,
            payment_method_id: 'pix',
            payer: {
                email,
                first_name,
                last_name: last_name || '',
            },
            notification_url:
                `${HEROKU_APP_NAME}/pix/status/pro/${uid}`
        };

        return await api.post("/v1/payments", body)
            .then(response => {
                console.log('CACHEEEEEE_ID: ', uid);
                setCache(
                    `pro:${uid}`,
                    JSON.stringify({
                        bank_payment_id: response.data.id,
                        //@ts-ignore
                        user_name: user.name,
                        //@ts-ignore
                        user_email: user.email
                    })
                ).then(() => res
                    .status(200)
                    .json({
                        linkBuyMercadoPago:
                            response
                                .data
                                .point_of_interaction
                                .transaction_data
                                .ticket_url
                    })
                    .end()
                ).catch((err: Error) => {
                    error(err)
                    return res
                        .status(500)
                        .json({ message: 'generate pro - set cache error' })
                        .end()
                });
            }).catch((err: Error) => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'generate pro payment - bank api error' })
                    .end()
            });
    },

    async status(req: Request, res: Response) {
        const { user_uid } = req.params;

        let data = await getCache(`pro:${user_uid}`);

        if (!data) {
            const message = 'make payment erro - no data!';
            error(message);
            return res
                .status(400)
                .json({ message })
                .end();
        }

        if (!isJson(data)) {
            const message = 'make payment erro - schema format';
            error(message);
            return res
                .status(400)
                .json({ message })
                .end();
        }

        data = JSON.parse(data);
        //@ts-ignore
        console.log(user_uid, data, data.bank_payment_id, data.user_name)
        //@ts-ignore
        if (!(user_uid && data && data.bank_payment_id && data.user_name))
            return res
                .status(400)
                .json({ message: 'make pro erro - no uid' })
                .end();

        //@ts-ignore
        const resource = resourceX(data.bank_payment_id);
        if (
            !resource ||
            !/^(ftp|http|https):\/\/[^ "]+$/.test(resource)
        ) {
            error('pix - resource regexEP.test failed 3');
            return res.sendStatus(204);
        }

        const fetchData = axios.create({
            baseURL: resource
        });
        fetchData.interceptors.request.use(async (config) => {
            config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
            return config;
        });

        await fetchData.get('')
            .then(async response => {
                if (response.data.status === "approved") {
                    await makePro(
                        res,
                        user_uid,
                        {
                            //@ts-ignore
                            email: data.user_email,
                            id: response.data.id,
                            date_approved: response.data.date_approved,
                            amount: response.data.transaction_amount,
                            //@ts-ignore
                            name: data.user_name
                        }
                    )
                } else return res.status(204).end();
            })
            .catch((err: Error) => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'make pro error - get bank status' })
                    .end()
            })
    }

};

export default pixController;