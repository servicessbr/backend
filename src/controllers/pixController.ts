import 'dotenv/config';

/*
    * Public
*/
const HEROKU_APP_NAME = require('../../public/constants/heroku_app_name');
const { setCache, getCache } = require('../../public/config/redisConfig');
const { URL_MERCADO_PAGO } = require('../../public/constants/URL');
const { PRICE, MIN_PAYMENT_X } = require('../../public/constants/priceTags');

import { error } from 'console';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Users from '../models/Users';
import { Request, Response } from 'express';

/*
    * Models
*/
import Orders from '../models/Orders';
import isJson from '../functions/isJson';
import transporter from '../email/transporter';
import voucherOptions from '../email/options/voucherOptions';
import cpf from '../functions/cpf';

import createOrder from './paymentsControllers';

const resourceX = (id: any) => `${URL_MERCADO_PAGO}/v1/payments/${id}`;

const api = axios.create({
    baseURL: URL_MERCADO_PAGO
});

api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
    return config;
});


const pixController = {
    orders: {
        async generatePayment(req: Request, res: Response) {
            //@ts-ignore
            const payer_customer_uid = req.uid;

            /*
                * transaction_amount: 
                    * Valor a ser paga pelo serviço.
                * paying_customer: 
                    * O payer_customer_uid que irá efetuar o pagamento.
                * customer_cpf: 
                    * O CPF desse cliente.
                * provider_professional_uid: 
                    * O profissional que irá realizar o serviço.
                * execution_date: 
                    * O dia que o serviço será realizado.
            */
            const {
                transaction_amount,
                provider_professional_uid,
                execution_date,
                original_subwork_title,
                customer_cpf,
                customer_full_name
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
                original_subwork_title &&
                customer_cpf && customer_full_name
            )) return res
                .status(400)
                .json({ message: 'payment error - missing data' })
                .end();

            if (!cpf(customer_cpf)) return 'payment error - cpf format';

            if (payer_customer_uid === provider_professional_uid) return res.status(403).json({ message: 'You can’t hire yourself.' })

            //@ts-ignore
            const users = await Users.findAll({
                raw: true,
                where: { uid: [payer_customer_uid, provider_professional_uid] },
                attributes: ['email', 'name', 'uid']
            })
                .catch((err:Error) => error(err));
            //@ts-ignore
            const user = users.filter(u => u.uid === payer_customer_uid)[0];
            //@ts-ignore
            const prof = users.filter(u => u.uid === provider_professional_uid)[0];

            console.log(users, user, prof);

            if (!(user && user.email && user.name && prof && prof.email && prof.name)) return res
                .status(400)
                .json({ message: 'payment error - cant get payer customer and prof data' })
                .end();

            const { email } = user;
            const first_name =
                customer_full_name
                    .slice(0, user.name.indexOf(' '))
                    .trim();
            const last_name =
                customer_full_name
                    .slice(user.name.indexOf(' '), user.name.length)
                    .trim();

            /*
              * Schema Validation -> Joi
          */
            if (!(email && first_name)) return res
                .status(400)
                .json({ message: 'payment error - missing email or first name' })
                .end();

            const description =
                `Contratação do serviço: "${original_subwork_title}"`;

            const cache_id = new Date().getTime() + uuidv4().slice(0, 4);

            const body = {
                transaction_amount,
                description,
                payment_method_id: 'pix',
                payer: {
                    email,
                    first_name,
                    last_name: last_name || '',
                    identification: {
                        type: 'CPF',
                        number: customer_cpf
                    },
                },
                notification_url:
                    `${HEROKU_APP_NAME}/pix/status/payment/${cache_id}`
            };

            return await api.post("/v1/payments", body)
                .then(async (response) => {
                    console.log('CACHEEEEEE_ID: ', cache_id);
                    return await setCache(
                        `payment:${cache_id}`,
                        JSON.stringify({
                            bank_payment_id: response.data.id,

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
                        .then(() => res
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
                        ).catch((err:Error) => {
                            error(err)
                            return res
                                .status(500)
                                .json({ message: 'generate payment - set cache error' })
                                .end()
                        });
                }).catch((err:Error) => {
                    error(err)
                    return res
                        .status(500)
                        .json({ message: 'generate payment - bank api error' })
                        .end()
                });
        },

        async getStatusAndMakeOrder(req: Request, res: Response) {
            const { cache_id } = req.params;
            const redisKey = `payment:${cache_id}`;
            let data = await getCache(redisKey);

            if (!isJson(data)) return res
                .status(400)
                .json({ message: 'make payment erro - schema format' })
                .end();

            data = JSON.parse(data);

            /*
                * Schema Validation -> Joi
            */
            if (!(
                data &&
                data.bank_payment_id &&
                data.payer_customer_uid &&
                data.payer_customer_name &&
                data.payer_customer_email &&
                data.provider_professional_uid &&
                data.provider_professional_name &&
                data.provider_professional_email &&
                data.execution_date &&
                data.transaction_amount &&
                data.original_subwork_title
            )) return res
                .status(400)
                .json({ message: 'make payment erro - schema validation failed' })
                .end();

            const resource = resourceX(data.bank_payment_id);
            if (
                !resource ||
                !/^(ftp|http|https):\/\/[^ "]+$/.test(resource)
            ) {
                error('pix - resource regexEP.test failed 2');
                return res.sendStatus(204);
            }

            const fetchData = axios.create({
                baseURL: resource
            });
            fetchData.interceptors.request.use(async (config) => {
                config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
                return config;
            });

            
            await fetchData.get()
                .then(async response => {
                    if (response.data.status === "approved") {
                        createOrder(res, data, redisKey);
                    } else return res.status(204).end();
                })
                .catch((err:Error) => {
                    error(err)
                    return res
                        .status(500)
                        .json({ message: 'make order error - get bank status' })
                        .end()
                })
        }
    },

    pro: {
        async generate(req: Request, res: Response) {
            const uid = req.uid;
            const pro = req.pro;

            if (pro) return res.status(204).json({ isPro: true }).end();

            const user = await Users.findOne({
                where: { uid },
                attributes: ['email', 'name']
            })
                .catch((err:Error) => error(err));
            if (!(user && user.email && user.name)) return res
                .status(400)
                .json({ message: 'payment pro error - cant get payer customer data' })
                .end();

            const { email } = user;
            const first_name =
                user.name
                    .slice(0, user.name.indexOf(' '))
                    .trim();
            const last_name =
                user.name
                    .slice(user.name.indexOf(' '), user.name.length)
                    .trim();
            const description =
                `Plano Servicess PRO @${uid}`;

            const body = {
                transaction_amount: PRICE,
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
                            user_name: user.name,
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
                    ).catch((err:Error) => {
                        error(err)
                        return res
                            .status(500)
                            .json({ message: 'generate pro - set cache error' })
                            .end()
                    });
                }).catch((err:Error) => {
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
            console.log(user_uid, data, data.bank_payment_id, data.user_name)
            if (!(user_uid && data && data.bank_payment_id && data.user_name))
                return res
                    .status(400)
                    .json({ message: 'make pro erro - no uid' })
                    .end();

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

            await fetchData.get()
                .then(async response => {
                    if (response.data.status === "approved") {
                        await Users.update(
                            {
                                pro: true
                            },
                            { where: { uid: user_uid } }
                        )
                            .then(async () => {
                                try {
                                    transporter.sendMail(
                                        voucherOptions(
                                            data.user_email,

                                            response.data.id,

                                            user_uid,
                                            response.data.date_approved,
                                            response.data.transaction_amount,

                                            data.user_name

                                        ), function (err, info) {
                                            if (err) {
                                                console.error(err)
                                            }
                                        });

                                } catch (err) {
                                    console.error('Payment | Push or E-mail Error: ', err)
                                };

                                return res.status(200).end()
                            })
                            .catch((err:Error) => {
                                error(err)
                                return res
                                    .status(500)
                                    .json({ message: 'make pro error - create pro' })
                                    .end()
                            })
                    } else return res.status(204).end();
                })
                .catch((err:Error) => {
                    error(err)
                    return res
                        .status(500)
                        .json({ message: 'make pro error - get bank status' })
                        .end()
                })
        }
    }
};

export default pixController;