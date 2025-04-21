import 'dotenv/config';
import { error } from 'console';
const lazyPush = require('../mobile/pushNotifications');
import { Response } from 'express';

/*
    * Models
*/
const Orders = require('../models/Orders');

const transporter = require('../email/transporter');
const Chat_Channel = require('../schemas/Chat_Channel');
const paymentOptions = require('../email/options/paymentOptions');
const { removeCache } = require('../../public/config/redisConfig');

const createOrder = async (res: Response, data: any, removeRadisKey: string) => {

    if (!(
        data &&
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

    await Orders.create({
        status: 'in_progress',
        ...data
    })
        .then(async () => {
            try {
                const channel = await Chat_Channel.find({
                    uid: [
                        data.payer_customer_uid,
                        data.provider_professional_uid
                    ]
                });

                console.log('channel: ', channel)

                channel[0] && lazyPush([
                    {
                        to: channel[0].ExponentPushToken,
                        sound: 'default',
                        body: '🔔 O agendamento foi realizado!',
                        data: {}
                    }
                ]);

                channel[1] && lazyPush([
                    {
                        to: channel[1].ExponentPushToken,
                        sound: 'default',
                        body: '🔔 O agendamento foi realizado!',
                        data: {}
                    }
                ]);

                transporter.sendMail(
                    paymentOptions(
                        data.provider_professional_email,
                        data.original_subwork_title,
                        data.payer_customer_name,
                        data.payer_customer_name,
                        data.transaction_amount,
                        data.execution_date
                    ), function (err: Error, info: any) {
                        if (err) {
                            console.error(err)
                        }
                    });

                transporter.sendMail(
                    paymentOptions(
                        data.payer_customer_email,
                        data.original_subwork_title,
                        data.payer_customer_name,
                        data.provider_professional_name,
                        data.transaction_amount,
                        data.execution_date
                    ), function (err: Error, info: any) {
                        if (err) {
                            console.error(err)
                        }
                    });

                removeRadisKey && await removeCache(removeRadisKey);
            } catch (err) {
                console.error('Payment | Push or E-mail Error: ', err)
            };

            return res.status(200).end();
        })
        .catch((err: Error) => {
            error(err)
            return res
                .status(500)
                .json({ message: 'make order error - create order' })
                .end()
        })
}

export default createOrder;