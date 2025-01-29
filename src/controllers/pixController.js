
require('dotenv').config();
const axios = require('axios');
const { QueryTypes } = require('sequelize');
const Users = require('../models/Users');
const Premiums = require('../models/Premiums');
const transporter = require('../config/email/transporter');
const premiumOptions = require('../config/email/options/premiumOptions');
const regexEP = require('../services/regexEP');
const Orders = require('../models/Orders');
/*const { v4: uuidv4 } = require('uuid');*/
const { getCache, setCache } = require("../config/redisConfig");
const ServiceOrderIntention = require('../schemas/ServiceOrderIntention');
const Chat_Channel = require('../schemas/Chat_Channel');
const serviceOrdersOptions = require('../config/email/options/soOptions');
const lazyPush = require('../helpers/pushNotifications');
//const Works = require('../models/Works');

const resourceX = (id) => `https://api.mercadopago.com/v1/payments/${id}`

const api = axios.create({
    baseURL: "https://api.mercadopago.com"
});

api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
    return config;
});

const priceTag = [
    {
        id: 0,
        amount: 19.9,
        mounths: 6
    },
    {
        id: 1,
        amount: 29.9,
        mounths: 12
    }
]

const handleSendPrimumEmail = (research, operation_number, date_approved, price, res) => {
    if (!(
        research[0].email &&
        research[0].name &&
        operation_number &&
        date_approved
    )) return console.error('handleSendPrimumEmail Error 1')

    const email = research[0].email;

    if (regexEP.email.test(email.trim().toLowerCase())) {
        transporter.sendMail(premiumOptions(
            operation_number,
            research[0].name,
            research[0].uid,
            date_approved,
            typeof price === 'string'
                ? price.toString().replace('.', ',')
                : price,
            email,
        ), function (err, info) {
            if (err) {
                res.status(200).end();
                console.error('handleSendPrimumEmail Error 2: ', err)
            } else return res.status(200).end();
        })
    }
}

const pixController = {
    premium: {
        async generatePayment(req, res) {

            const { price_id } = req.body;
            /*@ts-ignore*/
            const uid = req.uid;

            if (
                price_id === null ||
                price_id === undefined ||
                !uid ||
                typeof price_id !== 'number'
            ) return res.status(500).json({ message: 'Pix - preço ou id do anúncio não informado.' })

            const findC = priceTag.find((it) => it.id === price_id);
            /*@ts-ignore*/
            const currency = findC.amount;

            Users.findOne({ where: { uid } })
                .then((user) => {
                    if (!user) return res.status(401).json({ message: 'Pix - usuário não encontrado!' })

                    const body = {
                        transaction_amount: currency,
                        description: uid.toString().trim(),
                        payment_method_id: 'pix',
                        payer: {
                            email: user.email,
                            first_name: user.name,
                            last_name: user.uid
                        },
                        notification_url: `https://server-servicess-4e276bcb8ecf.herokuapp.com/pix/make/premium/status/${uid}`
                    }
                    /*
                    if (user.document && user.document.length === 11) {
                        //@ts-ignore
                        body.payer.identification =
                        {
                            type: 'CPF',
                            number: user.document
                        }
                    } else if (user.document && user.document.length > 11) {
                        //@ts-ignore
                        body.payer.identification =
                        {
                            type: 'CNPJ',
                            number: user.document
                        }
                    }
                    */
                    api.post("v1/payments", body)
                        .then(
                            response => {
                                return res.status(200).json({
                                    linkBuyMercadoPago: response.data.point_of_interaction.transaction_data.ticket_url
                                })
                            }
                        )
                        .catch(err => console.error(err));
                })
        },

        async statusAndMakePremium(req, res) {
            const { data } = req.body;

            if (!data) {
                console.error('nodata pix')
                return res.status(500).end()
            }

            const { user_uid } = req.params;

            const resource = resourceX(data.id)

            // Testa se tem uma URL válida:
            if (
                !resource ||
                !/^(ftp|http|https):\/\/[^ "]+$/.test(resource)
            ) {
                console.error('pix - resource regexEP.test failed 1');
                return res.sendStatus(204);
            }


            // Cria um REQUEST autenticado com essa URL:
            const fetchData = axios.create({
                baseURL: resource
            });

            fetchData.interceptors.request.use(async (config) => {
                config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
                return config;
            });

            try {
                /*@ts-ignore*/
                await fetchData.get()
                    .then(async response => {
                        if (response.data.status === "approved") {
                            // Pega os dados da compra retornados pelo Banco:
                            const price = response.data.transaction_amount;

                            //const uid = response.data.description.slice(x.indexOf('@')+1, x.length);
                            const uid = user_uid;
                            const get_date_approved = response.data.date_approved;
                            /*
                            const date_approved = Boolean(new Date(get_date_approved))
                                ? new Date(get_date_approved).toLocaleDateString('pt-Br')
                                : new Date().toLocaleDateString('pt-Br');
                
                            */
                            const date_approved = Boolean(new Date(get_date_approved))
                                ? new Date(get_date_approved)
                                : new Date();
                            const operation_number = response.data.id;

                            // Define o Periodo(Ex: 12 meses) baseado no preço:
                            const findM = priceTag.find(it => it.amount === price);


                            if (!findM) {
                                console.error('pix status - valores invalidos');
                                return res.status(204).end();
                            }
                            const mounths = findM.mounths;

                            // Gera um data de expiração:
                            const date = new Date();
                            /*@ts-ignore*/
                            const expireDate = new Date(date.setMonth(date.getMonth() + parseInt(mounths)));

                            if (!uid) return res.status(204).end();

                            // Busca o nome, o email e verifica se já tem uma tabela premium criada:
                            return Users.sequelize.query(
                                'SELECT  '
                                + 'users.name, users.email, premiums.id AS premium_id '
                                + 'FROM users  '
                                + 'LEFT JOIN premiums '
                                + 'ON (users.uid = premiums.user_uid) '
                                + `WHERE users.uid = '${uid}'; `,
                                {
                                    type: QueryTypes.SELECT
                                }
                            ).then((research) => {
                                if (!research && !research[0]) {
                                    console.error('pix status - usuario nao encontrado', research)
                                    return res.status(204).end();
                                }

                                if (research[0].premium_id) {
                                    // update
                                    /*@ts-ignore*/
                                    return Premiums.update(
                                        {
                                            expiration: expireDate
                                        },
                                        {
                                            where: { user_uid: uid.toString().trim() }
                                        }
                                    )
                                        .then(() => handleSendPrimumEmail(
                                            research, operation_number,
                                            date_approved, findM.amount, res
                                        ))
                                        .catch((err) => {
                                            console.error(err)
                                            return res.status(204).end();
                                        });
                                } else {
                                    // update
                                    /*@ts-ignore*/
                                    return Premiums.create({
                                        expiration: expireDate,
                                        user_uid: uid.toString().trim()

                                    }).then(() => handleSendPrimumEmail(
                                        research, operation_number,
                                        date_approved, findM.amount, res
                                    ))
                                        .catch((err) => {
                                            console.error('ERRRR', err)
                                            return res.status(204).end();
                                        });
                                }

                            })

                            /*
                            uid && await Users.update(
                                {
                                    premium: expireDate
                                },
                                {
                                    where: { uid: uid.toString().trim() },
                                    returning: ['name', 'email'],
                                    plain: true
                                }
                            )
                                .then((result) => {
                
                                    if (!(
                                        result &&
                                        result[1] &&
                                        result[1].dataValues
                                    )) return res.status(204).end();
                
                                    const email = result[1].dataValues.email;
                
                                    if (regexEP.email.test(email.trim().toLowerCase())) {
                                        transporter.sendMail(premiumOptions(
                                            operation_number,
                                            result[1].dataValues.name,
                                            uid,
                                            date_approved,
                                            typeof price === 'string'
                                                ? price.toString().replace('.', ',')
                                                : price,
                                            email,
                                        ), function (err, info) {
                                            if (!err) {
                                                return res.status(204).end();
                                            }
                                        })
                                    } return res.status(204).end();
                                }
                
                                )
                                .catch((err) => {
                                    console.error(err)
                                    return res.status(204).end();
                                });
                                */
                        }
                    })
            } catch (err) { console.error('pix - error on try fetch api'); return res.sendStatus(204) }

        }
    },

    serviceOrder: {
        async generatePayment(req, res) {
            const { so_unique_id } = req.body;
            const uid = req.uid;

            const soData = await ServiceOrderIntention.findOne({
                so_unique_id
            });

            if (!soData) return res.status(500).json({ message: 'Pix - Service Order - Sem dados.' })

            if (!soData.prof_uid)
                return res.status(500).json({ message: 'Pix - Service Order - id do profissional não informado.' })

            if (
                soData.price === null ||
                soData.price === undefined ||
                !uid ||
                typeof soData.price !== 'number'
            ) return res.status(500).json({ message: 'Pix - Service Order - preço ou id não informado.' })

            if (!(soData.price > 15 || uid === 'a1-e9174b25-54' || uid === '9cda8056-e')) return res.status(500).json({ message: 'Pix - Service Order - valor menor que 15' });

            const currency = soData.price;

            /*const so_unique_id = new Date().getTime() + uuidv4().slice(0, 4);*/
            /*const so_unique_id = soData.so_unique_id;*/

            Users.findOne({ where: { uid } })
                .then((user) => {
                    if (!user) return res.status(401).json({ message: 'Pix - Service Order - usuário não encontrado!' })

                    const body = {
                        transaction_amount: currency,
                        description: `Plano PRO para o usuário com ID Público @${uid.toString().trim()}`,
                        payment_method_id: 'pix',
                        payer: {
                            email: user.email,
                            first_name: user.name,
                            last_name: user.uid
                        },
                        notification_url: `https://server-servicess-4e276bcb8ecf.herokuapp.com/pix/generate/so/status/${so_unique_id}`
                    }
                    api.post("v1/payments", body)
                        .then(
                            async (response) => {
                                await setCache(`pix/so/${so_unique_id}`, JSON.stringify(response.data.id))
                                return res.status(200).json({
                                    linkBuyMercadoPago: response.data.point_of_interaction.transaction_data.ticket_url
                                })
                            }
                        )
                        .catch(err => console.error(err));
                })
        },

        async statusAndGenerateSO(req, res) {
            const { data } = req.body;

            /*if (!data) {
                console.error('nodata pix')
                return res.status(500).end()
            }*/

            const { so_unique_id } = req.params;

            const data_id =
                (data && data.id)
                    ? data.id
                    : await getCache(`pix/so/${so_unique_id}`);

            const resource = resourceX(data_id)

            console.log('IIIIIIIIIINNNNNNNNNNNNNNNNNNN: ', resource);

            console.log('--------- resource: ', resource)
            console.log('--------- so_unique_id: ', so_unique_id)

            const soData = await ServiceOrderIntention.findOne({
                so_unique_id
            })
                .catch((err) => console.error(err));

            console.log('--------- soData: ', soData)

            if (!so_unique_id && typeof so_unique_id !== 'string') return res.status(500).json({ message: 'pix error - so_unique_id' })
            if (!soData) return res.status(500).json({ message: 'pix error - soData' })

            console.log('--------- 1 ')

            if (
                !resource ||
                !/^(ftp|http|https):\/\/[^ "]+$/.test(resource)
            ) {
                console.error('pix - resource regexEP.test failed 2');
                return res.sendStatus(204);
            }

            console.log('--------- 2 ')

            const fetchData = axios.create({
                baseURL: resource
            });

            console.log('--------- 3 ')

            fetchData.interceptors.request.use(async (config) => {
                config.headers.Authorization = `Bearer ${process.env.PIX_AUTH_KEY}`;
                return config;
            });

            console.log('--------- 4 ')

            try {
                await fetchData.get()
                    .then(async response => {
                        const finalData =
                        {
                            so_unique_id: so_unique_id,
                            client_uid: soData.client_uid,
                            prof_uid: soData.prof_uid,
                            price: soData.price,
                            ser_description: soData.ser_description,
                            ser_response: soData.ser_response,
                            loc_place: soData.loc_place,
                            loc_location: soData.loc_location,
                            date_hours: soData.date_hours,
                            date_month: soData.date_month,
                            date_day: soData.date_day,
                            date_week: soData.date_week,
                            pix: soData.pix,
                            work_ref: soData.work_ref
                        }

                        console.log('--------- 5 ')

                        if (response.data.status === "approved") {

                            console.log('--------- 6 ')
                            const price = response.data.transaction_amount;
                            const uid = response.data.description;
                            const get_date_approved = response.data.date_approved;

                            const date_approved = Boolean(new Date(get_date_approved))
                                ? new Date(get_date_approved)
                                : new Date();
                            const operation_number = response.data.id;

                            console.log('---------( 7 )---------')

                            return Orders.create(finalData)

                                .then(async () => {
                                    console.log('--------- 8 ')

                                    await ServiceOrderIntention.deleteOne({
                                        so_unique_id
                                    });

                                    try {
                                        const channel = await Chat_Channel.find({
                                            uid: [
                                                soData.client_uid,
                                                soData.prof_uid
                                            ]
                                        });
                    
                                        console.log('channel: ', channel)
                    
                                        channel[0] && lazyPush([
                                            {
                                                to: channel[0].ExponentPushToken,
                                                sound: 'default',
                                                body: '🔔 O agendamento foi realizado!',
                                                data: {},
                                            }
                                        ])
                    
                                        channel[1] && lazyPush([
                                            {
                                                to: channel[1].ExponentPushToken,
                                                sound: 'default',
                                                body: '🔔 O agendamento foi realizado!',
                                                data: {},
                                            }
                                        ])
                    
                                        transporter.sendMail(
                                            serviceOrdersOptions(
                                                soData.prof_email, 'prof',
                                                soData.client_name, soData.price,
                                                soData.loc_location,
                                                soData.date_hours, soData.date_day,
                                                soData.date_week, soData.date_month,
                                            ), function (err, info) {
                                                if (err) {
                                                    console.error(err)
                                                }
                                            });
                    
                                        transporter.sendMail(
                                            serviceOrdersOptions(
                                                soData.client_email, 'client',
                                                soData.client_name, soData.price,
                                                soData.loc_location,
                                                soData.date_hours, soData.date_day,
                                                soData.date_week, soData.date_month,
                                            ), function (err, info) {
                                                if (err) {
                                                    console.error(err)
                                                }
                                            });
                    
                                    } catch (error) {
                                        console.error('Generate SO | Push or E-mail Error: ', error)
                                    }

                                    return res.status(200).end()
                                })
                                .catch((err) => {
                                    console.error('ERRRR', err)
                                    return res.status(204).end();
                                });
                        }
                    })
            } catch (err) { console.error('---------- ERROR: ', err) }
        }
    }
}

module.exports = pixController