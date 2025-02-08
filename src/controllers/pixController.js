require('dotenv').config();
const { error } = require('console');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const HEROKU_APP_NAME = require('../../public/constants/heroku_app_name');
const { setCache, getCache } = require('../../public/config/redisConfig');
const Users = require('../models/Users');

/*
    * Models
*/
const Orders = require('../models/Orders');
const isJson = require('../functions/isJson');

//const baseURL = "https://api.mercadopago.com"
const baseURL = "http://192.168.0.178:8001"

const resourceX = (id) => `${baseURL}/v1/payments/${id}`;

const api = axios.create({
    baseURL
});

api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
    return config;
});

const pixController = {
    async generatePayment(req, res) {
        const payer_customer_uid = req.uid;

        /*
            * payment_amount: 
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
            payment_amount,
            provider_professional_uid,
            execution_date,
            original_subwork_title
        } = req.body;

        const user = await Users.findOne({
            where: { uid: payer_customer_uid },
            attributes: ['email', 'name']
        })
            .catch(err => error(err));
        if (!(user && user.email && user.name)) return res
            .status(400)
            .json({ message: 'payment error - cant get payer customer data' })
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

        console.log({
            payment_amount,
            payer_customer_uid, provider_professional_uid,
            execution_date, email, first_name,
            original_subwork_title
        })

        /*
            * Schema Validation -> Joi
        */
        if (!(
            payment_amount && typeof payment_amount === 'number' &&
            payer_customer_uid && provider_professional_uid &&
            execution_date && email && first_name &&
            original_subwork_title
        )) return res
            .status(400)
            .json({ message: 'payment error - missing data' })
            .end();

        const description =
            `Pagamento referente à contratação do serviço: "${original_subwork_title}"`;

        const cache_id = new Date().getTime() + uuidv4().slice(0, 4);

        const body = {
            payment_amount,
            description,
            payment_method_id: 'pix',
            payer: {
                email,
                first_name,
                last_name: last_name || '',
            },
            notification_url:
                `${HEROKU_APP_NAME}/pix/status/make/${cache_id}`
        };

        await api.post("/v1/payments", body)
            .then(async (response) => {
                console.log('response: ', response.data)
                await setCache(
                    `pix/payment/${cache_id}`,
                    JSON.stringify({
                        bank_payment_id: response.data.id,

                        payer_customer_uid,
                        provider_professional_uid,
                        execution_date,
                        payment_amount,
                        original_subwork_title
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
                ).catch(err => {
                    error(err)
                    return res
                        .status(500)
                        .json({ message: 'generate payment - set cache error' })
                        .end()
                });
            }).catch(err => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'generate payment - bank api error' })
                    .end()
            });
    },

    async getStatusAndMakeOrder(req, res) {
        const { cache_id } = req.params;

        let data = await getCache(`pix/payment/${cache_id}`);

        if (!isJson(data)) return res
            .status(400)
            .json({ message: 'make payment erro - schema format' })
            .end();

        data = JSON.parse(data);

        console.log('DATA: ', data);

        /*
            * Schema Validation -> Joi
        */
        if (!(
            data &&
            data.bank_payment_id &&
            data.payer_customer_uid &&
            data.provider_professional_uid &&
            data.execution_date &&
            data.payment_amount &&
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

        console.log('resourceX: ', resource)

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
                    await Orders.create({
                        status: 'in_progress',
                        ...data
                    })
                        .then(() => res.status(200).end())
                        .catch(err => {
                            error(err)
                            return res
                                .status(500)
                                .json({ message: 'make order error - create order' })
                                .end()
                        })
                } else return res.status(204).end();
            })
            .catch(err => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'make order error - get bank status' })
                    .end()
            })

    }
};

module.exports = pixController;