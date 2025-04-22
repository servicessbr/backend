"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const console_1 = require("console");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const Users_1 = __importDefault(require("../models/Users"));
const isJson_1 = __importDefault(require("../functions/isJson"));
const transporter_1 = __importDefault(require("../email/transporter"));
const voucherOptions_1 = __importDefault(require("../email/options/voucherOptions"));
const cpf_1 = __importDefault(require("../functions/cpf"));
const paymentsControllers_1 = __importDefault(require("./paymentsControllers"));
const URL_1 = require("../configs/constants/URL");
const priceTags_1 = require("../configs/constants/priceTags");
const heroku_app_name_1 = __importDefault(require("../configs/constants/heroku_app_name"));
const redisConfig_1 = require("../configs/cache/redisConfig");
const resourceX = (id) => `${URL_1.URL_MERCADO_PAGO}/v1/payments/${id}`;
const api = axios_1.default.create({
    baseURL: URL_1.URL_MERCADO_PAGO
});
api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
    return config;
});
const pixController = {
    orders: {
        async generatePayment(req, res) {
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
            const { transaction_amount, provider_professional_uid, execution_date, original_subwork_title, customer_cpf, customer_full_name } = req.body;
            /*
                * Schema Validation -> Joi
            */
            if (!(transaction_amount &&
                typeof transaction_amount === 'number' &&
                transaction_amount >= priceTags_1.MIN_PAYMENT_X &&
                payer_customer_uid && provider_professional_uid &&
                execution_date &&
                original_subwork_title &&
                customer_cpf && customer_full_name))
                return res
                    .status(400)
                    .json({ message: 'payment error - missing data' })
                    .end();
            if (!(0, cpf_1.default)(customer_cpf))
                return 'payment error - cpf format';
            if (payer_customer_uid === provider_professional_uid)
                return res.status(403).json({ message: 'You can’t hire yourself.' });
            //@ts-ignore
            const users = await Users_1.default.findAll({
                raw: true,
                where: { uid: [payer_customer_uid, provider_professional_uid] },
                attributes: ['email', 'name', 'uid']
            })
                .catch((err) => (0, console_1.error)(err));
            //@ts-ignore
            const user = users.filter(u => u.uid === payer_customer_uid)[0];
            //@ts-ignore
            const prof = users.filter(u => u.uid === provider_professional_uid)[0];
            console.log(users, user, prof);
            if (!(user && user.email && user.name && prof && prof.email && prof.name))
                return res
                    .status(400)
                    .json({ message: 'payment error - cant get payer customer and prof data' })
                    .end();
            const { email } = user;
            const first_name = customer_full_name
                .slice(0, user.name.indexOf(' '))
                .trim();
            const last_name = customer_full_name
                .slice(user.name.indexOf(' '), user.name.length)
                .trim();
            /*
              * Schema Validation -> Joi
          */
            if (!(email && first_name))
                return res
                    .status(400)
                    .json({ message: 'payment error - missing email or first name' })
                    .end();
            const description = `Contratação do serviço: "${original_subwork_title}"`;
            const cache_id = new Date().getTime() + (0, uuid_1.v4)().slice(0, 4);
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
                notification_url: `${heroku_app_name_1.default}/pix/status/payment/${cache_id}`
            };
            return await api.post("/v1/payments", body)
                .then(async (response) => {
                console.log('CACHEEEEEE_ID: ', cache_id);
                return await (0, redisConfig_1.setCache)(`payment:${cache_id}`, JSON.stringify({
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
                }))
                    .then(() => res
                    .status(200)
                    .json({
                    linkBuyMercadoPago: response
                        .data
                        .point_of_interaction
                        .transaction_data
                        .ticket_url
                })
                    .end()).catch((err) => {
                    (0, console_1.error)(err);
                    return res
                        .status(500)
                        .json({ message: 'generate payment - set cache error' })
                        .end();
                });
            }).catch((err) => {
                (0, console_1.error)(err);
                return res
                    .status(500)
                    .json({ message: 'generate payment - bank api error' })
                    .end();
            });
        },
        async getStatusAndMakeOrder(req, res) {
            const { cache_id } = req.params;
            const redisKey = `payment:${cache_id}`;
            let data = await (0, redisConfig_1.getCache)(redisKey);
            //@ts-ignore
            if (!(0, isJson_1.default)(data))
                return res
                    .status(400)
                    .json({ message: 'make payment erro - schema format' })
                    .end();
            //@ts-ignore
            data = JSON.parse(data);
            /*
                * Schema Validation -> Joi
            */
            if (!(data &&
                //@ts-ignore
                data.bank_payment_id &&
                //@ts-ignore
                data.payer_customer_uid &&
                //@ts-ignore
                data.payer_customer_name &&
                //@ts-ignore
                data.payer_customer_email &&
                //@ts-ignore
                data.provider_professional_uid &&
                //@ts-ignore
                data.provider_professional_name &&
                //@ts-ignore
                data.provider_professional_email &&
                //@ts-ignore
                data.execution_date &&
                //@ts-ignore
                data.transaction_amount &&
                //@ts-ignore
                data.original_subwork_title))
                return res
                    .status(400)
                    .json({ message: 'make payment erro - schema validation failed' })
                    .end();
            //@ts-ignore
            const resource = resourceX(data.bank_payment_id);
            if (!resource ||
                !/^(ftp|http|https):\/\/[^ "]+$/.test(resource)) {
                (0, console_1.error)('pix - resource regexEP.test failed 2');
                return res.sendStatus(204);
            }
            const fetchData = axios_1.default.create({
                baseURL: resource
            });
            fetchData.interceptors.request.use(async (config) => {
                config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
                return config;
            });
            await fetchData.get('')
                .then(async (response) => {
                if (response.data.status === "approved") {
                    (0, paymentsControllers_1.default)(res, data, redisKey);
                }
                else
                    return res.status(204).end();
            })
                .catch((err) => {
                (0, console_1.error)(err);
                return res
                    .status(500)
                    .json({ message: 'make order error - get bank status' })
                    .end();
            });
        }
    },
    pro: {
        async generate(req, res) {
            //@ts-ignore
            const uid = req.uid;
            //@ts-ignore
            const pro = req.pro;
            if (pro)
                return res.status(204).json({ isPro: true }).end();
            //@ts-ignore
            const user = await Users_1.default.findOne({
                where: { uid },
                attributes: ['email', 'name']
            })
                .catch((err) => (0, console_1.error)(err));
            //@ts-ignore
            if (!(user && user.email && user.name))
                return res
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
            const description = `Plano Servicess PRO @${uid}`;
            const body = {
                transaction_amount: priceTags_1.PRICE,
                description,
                payment_method_id: 'pix',
                payer: {
                    email,
                    first_name,
                    last_name: last_name || '',
                },
                notification_url: `${heroku_app_name_1.default}/pix/status/pro/${uid}`
            };
            return await api.post("/v1/payments", body)
                .then(response => {
                console.log('CACHEEEEEE_ID: ', uid);
                (0, redisConfig_1.setCache)(`pro:${uid}`, JSON.stringify({
                    bank_payment_id: response.data.id,
                    //@ts-ignore
                    user_name: user.name,
                    //@ts-ignore
                    user_email: user.email
                })).then(() => res
                    .status(200)
                    .json({
                    linkBuyMercadoPago: response
                        .data
                        .point_of_interaction
                        .transaction_data
                        .ticket_url
                })
                    .end()).catch((err) => {
                    (0, console_1.error)(err);
                    return res
                        .status(500)
                        .json({ message: 'generate pro - set cache error' })
                        .end();
                });
            }).catch((err) => {
                (0, console_1.error)(err);
                return res
                    .status(500)
                    .json({ message: 'generate pro payment - bank api error' })
                    .end();
            });
        },
        async status(req, res) {
            const { user_uid } = req.params;
            let data = await (0, redisConfig_1.getCache)(`pro:${user_uid}`);
            if (!data) {
                const message = 'make payment erro - no data!';
                (0, console_1.error)(message);
                return res
                    .status(400)
                    .json({ message })
                    .end();
            }
            if (!(0, isJson_1.default)(data)) {
                const message = 'make payment erro - schema format';
                (0, console_1.error)(message);
                return res
                    .status(400)
                    .json({ message })
                    .end();
            }
            data = JSON.parse(data);
            //@ts-ignore
            console.log(user_uid, data, data.bank_payment_id, data.user_name);
            //@ts-ignore
            if (!(user_uid && data && data.bank_payment_id && data.user_name))
                return res
                    .status(400)
                    .json({ message: 'make pro erro - no uid' })
                    .end();
            //@ts-ignore
            const resource = resourceX(data.bank_payment_id);
            if (!resource ||
                !/^(ftp|http|https):\/\/[^ "]+$/.test(resource)) {
                (0, console_1.error)('pix - resource regexEP.test failed 3');
                return res.sendStatus(204);
            }
            const fetchData = axios_1.default.create({
                baseURL: resource
            });
            fetchData.interceptors.request.use(async (config) => {
                config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
                return config;
            });
            await fetchData.get('')
                .then(async (response) => {
                if (response.data.status === "approved") {
                    //@ts-ignore
                    await Users_1.default.update({
                        pro: true
                    }, { where: { uid: user_uid } })
                        .then(async () => {
                        try {
                            transporter_1.default.sendMail((0, voucherOptions_1.default)(
                            //@ts-ignore
                            data.user_email, response.data.id, user_uid, response.data.date_approved, response.data.transaction_amount, 
                            //@ts-ignore
                            data.user_name), function (err, info) {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        }
                        catch (err) {
                            console.error('Payment | Push or E-mail Error: ', err);
                        }
                        ;
                        return res.status(200).end();
                    })
                        .catch((err) => {
                        (0, console_1.error)(err);
                        return res
                            .status(500)
                            .json({ message: 'make pro error - create pro' })
                            .end();
                    });
                }
                else
                    return res.status(204).end();
            })
                .catch((err) => {
                (0, console_1.error)(err);
                return res
                    .status(500)
                    .json({ message: 'make pro error - get bank status' })
                    .end();
            });
        }
    }
};
exports.default = pixController;
