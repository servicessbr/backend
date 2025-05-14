import 'dotenv/config';

import { error } from 'console';
import { Response } from 'express';

import transporter from '../email/transporter';
import Users from '../models/Users';
import voucherOptions from '../email/options/voucherOptions';
import addOneYear from '../functions/addOneYear';

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
    const user = await Users.findOne({
        where: { uid: user_uid },
        attributes: ['pro', 'vip']
    }).catch(err => error(err))

    //@ts-ignore
    const { pro, vip } = user;

    let update = { pro, vip };

    switch (transaction.amount) {
        case 19.9:
            update = {
                pro: addOneYear(pro, 'pro'),
                vip
            }
            break;

        case 6.9:
            update = {
                pro,
                vip: addOneYear(pro, 'pre')
            }
            break;

        case 39.9:
            update = {
                pro,
                vip: addOneYear(pro, 'vip')
            }
            break;

        default:
            break;
    }

    //@ts-ignore
    await Users.update(
        update,
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