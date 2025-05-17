
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { error } from 'console';
import { Request, Response, NextFunction } from 'express';

import Users from "../models/Users";

export default async function isVip(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    console.log(1, auth, token)

    if (
        token === null ||
        token === undefined
    ) {
        return next();
    };
    console.log(2)
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch (err) {
        return next();
    }
    console.log(3)

    const { uid }: any = jwt.decode(token);

    console.log(4)

    if (uid === null) {
        return next()
    };
    console.log(5)
    //@ts-ignore
    const user = await Users.findOne({
        attributes: ['vip'],
        where: { uid }
    }).catch(err => error(err));

    try {
        //@ts-ignore
        const vip = new Date(user?.vip);

        console.log(
            'IS_VIPPPPPPPPPP??',
            //@ts-ignore
            vip,
            //@ts-ignore
            (vip instanceof Date),
            //@ts-ignore
            (vip > new Date())
        )

        //@ts-ignore
        req.vip = (vip > new Date());

        next();
    } catch {
        next();
    }
}