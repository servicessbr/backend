import 'dotenv/config';
import jwt from 'jsonwebtoken';

import Users from "../../models/Users";

const authio = async (socket: any, next: any) => {
    if (socket.handshake.query && socket.handshake.query.token) {

        const token = socket.handshake.query.token;

        if (
            token === null ||
            token === undefined
        ) {

            console.error('Authentication error 1')
            return next(new Error('Authentication error 2'));
        };

        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        } catch (err) {

            console.error('Authentication error 3')
            return next(new Error('invalide token'));
        }


        const { uid, refreshtoken }:any = jwt.decode(token);

        if (uid === null) {

            console.error('Authentication error 4')
            return next(new Error('null uid'));
        };
        if (refreshtoken === null) {

            console.error('Authentication error 5')
            return next(new Error('null refreshtoken'));
        };

        //@ts-ignore
        await Users.findOne({
            attributes: ['refreshtoken'],
            where: { uid }
        })
            .then((data: any) => {
                if (data === null) {

                    console.error('Authentication error 6')
                    return next(new Error('auth user not found'));
                } else if (data.blocked) {

                    console.error('Authentication error 7')
                    return next(new Error('Essa conta foi desativada por violar o art. ' + '12.6'));
                } else {

                    return next();
                };
            })
            .catch((e: Error) => {


                console.error(e)
                return next(new Error('token error'));
            })
    } else {
        console.error('Authentication error 8')
        next(new Error('Authentication error 9'));
    }
}

export default authio;