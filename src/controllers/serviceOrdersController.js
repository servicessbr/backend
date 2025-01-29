const ServiceOrderIntention = require('../schemas/ServiceOrderIntention')
const so_status = require('../constants/service_orders_status.json')
const { v4: uuidv4 } = require('uuid');
const Orders = require('../models/Orders');
const { QueryTypes } = require('sequelize');
const Users = require('../models/Users');
const transporter = require('../config/email/transporter')
const serviceOrdersIntentionsOptions = require('../config/email/options/soIntentionOptions');
const soResponseOptions = require('../config/email/options/soResponseOptions');
const Chat_Channel = require('../schemas/Chat_Channel');
const lazyPush = require('../helpers/pushNotifications');

const serviceOrders = {
    async validation(req, res) {
        const { client_uid, prof_uid } = req.query

        const havePostgresSO = await Orders.findOne({
            where: {
                client_uid,
                prof_uid,
                finished: false
            }
        })

        const haveMongoSO = await ServiceOrderIntention.find({
            client_uid,
            prof_uid
        })

        res.status(200).json((Boolean(haveMongoSO.length) || Boolean(havePostgresSO)));
    },
    async intention(req, res) {
        const {
            client_name,
            prof_uid,
            prof_name,
            work_ref,
            work_title,
            ser_description,
            loc_place,
            loc_location,
            date_hours,
            date_month,
            date_day,
            date_week
        } = req.body;

        const uid = req.uid;

        const so_unique_id = new Date().getTime() + uuidv4().slice(0, 4);

        const emails = await Users.findAll({
            where: {
                uid: [uid, prof_uid],
            },
            attributes: ['uid', 'email']
        });

        const client_email =
            emails[0].uid === uid
                ? emails[0].email
                : emails[1].email;

        const prof_email =
            emails[1].uid === prof_uid
                ? emails[1].email
                : emails[0].email;

        await ServiceOrderIntention.create({
            so_unique_id: so_unique_id,
            unique_id: so_unique_id,
            client_uid: uid,
            client_name,
            client_email,
            prof_uid,
            prof_name,
            prof_email,
            work_ref,
            work_title,
            status: so_status[0],
            ser_description,
            loc_place,
            loc_location,
            date_hours,
            date_month,
            date_day,
            date_week
        })
            .then(async () => {
                try {
                    const channel = await Chat_Channel.findOne({ uid: prof_uid });

                    console.log('channel', channel)

                    channel && lazyPush([
                        {
                            to: channel.ExponentPushToken,
                            sound: 'default',
                            body: 'Você recebeu uma solicitação de contratação. Acesse suas ordens de serviço para ver os detalhes e responder rapidamente!',
                            data: {},
                        }
                    ])

                    transporter.sendMail(
                        serviceOrdersIntentionsOptions(
                            prof_email,
                            prof_name, client_name,
                            `${date_day} ${date_month}`, `${date_week} ${date_hours}`, loc_location,
                            ser_description
                        ), function (err, info) {
                            if (err) {
                                console.error(err)
                                return res.status(500).json({ message: 'send email error - intention' })
                            } else {
                                return res.status(200).end();
                            }
                        });

                } catch (error) {
                    console.error(error)
                }
            })
            .catch(err => console.error(err));


    },

    async response(req, res) {
        const { so_unique_id, price, ser_response, pix } = req.body;

        if (price < 15) res.status(500).json({ message: 'Valor menor que R$ 15,00' });

        const uid = req.uid;

        const SO = await ServiceOrderIntention.findOne({ so_unique_id })
            .catch(err => console.error(err));

        if (!SO) return res.status(404).json({ message: 'Não foi encontrada nenhuma intenção' });

        if (uid !== SO.prof_uid) return res.status(401).json({ message: 'O ID de autorização é diferente do ID do profissional' });

        SO.price = price;
        SO.ser_response = ser_response;
        SO.pix = pix;

        await SO.save()
            .then(async () => {
                try {
                    const channel = await Chat_Channel.findOne({ uid: SO.client_uid });

                    console.log('channel', channel)

                    channel && lazyPush([
                        {
                            to: channel.ExponentPushToken,
                            sound: 'default',
                            body: 'O orçamento ficou pronto! Você pode agora concluir a contratação.',
                            data: {},
                        }
                    ])

                    transporter.sendMail(
                        soResponseOptions(SO.client_email, SO.prof_name),
                        function (err, info) {
                            if (err) {
                                console.error(err)
                                return res.status(204).json({ message: 'Não foi possível enviar o e-mail de resposta' })
                            } else {
                                return res.status(200).end();
                            }
                        });
                } catch (error) {
                    return res.status(204).json({ message: 'Erro ao tentar enviar o e-mail' })
                }
            })
            .catch((e) => {
                console.error(e)
                return res.status(500).json({ message: 'Não foi possível salvar a reposta' })
            });
    },

    list: {
        async responses(req, res) {
            const uid = req.uid;

            const serviceOrderIntention = await ServiceOrderIntention.find({
                client_uid: uid
            });

            const postgresIntentions = await Orders.sequelize.query(
                ' SELECT '
                + ' orders.*, client.name AS client_name'
                + ' FROM orders '
                + ' INNER JOIN users AS client ON (orders.client_uid = client.uid) '
                + ' WHERE client_uid = :uid AND finished IS false; ',
                {
                    replacements: { uid },
                    type: QueryTypes.SELECT
                }
            )

            return res.status(200).json([postgresIntentions, serviceOrderIntention])

        },

        async intentions(req, res) {
            const uid = req.uid;

            const monoResponse = await ServiceOrderIntention.find({
                prof_uid: uid
            });

            const postgresResponse = await Orders.sequelize.query(
                ' SELECT '
                + ' orders.*, works.title, prof.name AS prof_name, prof.profession'
                + ' FROM orders '
                + ' INNER JOIN users AS prof ON (orders.prof_uid = prof.uid) '
                + ' INNER JOIN works ON (orders.work_ref = works.id) '
                + ' WHERE prof_uid = :uid AND finished IS false; ',
                {
                    replacements: { uid },
                    type: QueryTypes.SELECT
                }
            )

            return res.status(200).json([postgresResponse, monoResponse])
            /*return res.status(200).json(postgresResponse.concat(monoResponse))*/
        },
    }
}

module.exports = serviceOrders;