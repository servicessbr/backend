
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { error } from 'console';
import { Request, Response, NextFunction } from 'express';

import Users from "../../models/Users";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    if (
        token === null ||
        token === undefined
    ) {
        return res.status(401).end();
    };

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch (err) {
        return res.status(403).json({ message: 'invalide token' });
    }

    const { uid, email, refreshtoken }:any = jwt.decode(token);

    if (uid === null) {
        return res.status(500).json({ message: 'null uid' })
    };
    if (refreshtoken === null) {
        return res.status(500).json({ message: 'null refreshtoken' })
    };

    //@ts-ignore
    await Users.findOne({
        attributes: ['refreshtoken', 'blocked', 'pro'],
        where: { uid }
    })
        .then((data:any) => {
            if (data === null) {
                return res.status(500).json({ message: 'auth user not found' })
            } else if (data.blocked) {
                return res.status(500).json({ message: 'Essa conta foi desativada por violar o art. ' + '12.6' })
            } else {
                //@ts-ignore
                req.uid = uid;
                //@ts-ignore
                req.email = email;
                //@ts-ignore
                req.pro = data.pro;
                return next();
            };
        })
        .catch((err:Error) => {
            error(err)
            return res.status(500).json({ message: "token error" })
        })
}

export default authorization;