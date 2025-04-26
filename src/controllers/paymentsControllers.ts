import 'dotenv/config';


import { error } from 'console';
import lazyPush from '../mobile/pushNotifications';
import { Response } from 'express';

/*
    * Models
*/
import Orders from '../models/Orders';

import transporter from '../email/transporter';
import Chat_Channel from '../schemas/Chat_Channel';
import paymentOptions from '../email/options/paymentOptions';
import { removeCache } from '../configs/cache/redisConfig';
import Users from '../models/Users';
import voucherOptions from '../email/options/voucherOptions';

export const createOrder = async (res: Response, data: any, removeRadisKey: string) => {

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

    //@ts-ignore
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
                    ), function (err: Error | null, info: any) {
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
                    ), function (err: Error | null, info: any) {
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

export const makePro = async (
    res: Response,
    user_uid: string,
    transaction: {
        id: string,
        date_approved: Date,
        amount: number,
        email: string,
        name: string,
    }
) => {
    //@ts-ignore
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
                        //@ts-ignore
                        transaction.email,

                        transaction.id,

                        user_uid,
                        transaction.date_approved,
                        transaction.amount,

                        //@ts-ignore
                        transaction.name

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
        .catch((err: Error) => {
            error(err)
            return res
                .status(500)
                .json({ message: 'make pro error - create pro' })
                .end()
        })
}