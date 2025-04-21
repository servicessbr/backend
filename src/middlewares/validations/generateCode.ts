
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import regexEP from '../../functions/regexEP';
import { v4 as uuidv4 } from 'uuid';

/* 
    * Models:
*/
import Users from '../../models/Users';


/* 
    * Radis 
*/
import { Request, Response, NextFunction } from 'express';
//import { Result } from 'ioredis';
import { getCache, setCache } from '../../configs/cache/redisConfig';

const generateCode = {
    /* 
        *Alterar qualquer dado sensível do usuário (ex:senha, email, telefone).
    */
    async utoken(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        const email = req.email;

        if (
            email === null ||
            email === undefined
        ) {
            return res.status(401).end()
        };

        if (!regexEP.email.test(email.trim().toLowerCase())) {
            return res.status(400).json({ message: 'invalid email format' })
        };

        const utoken = jwt.sign(
            { email },

            process.env.URL_TOKEN as string,
            { expiresIn: 10 * 60 }
        );

        //@ts-ignore
        await Users.findOne({
            where: { email }
        })
            .then((result: any) => {
                if (!result) {



                    return res.status(400).json({ message: 'E-mail não foi encontrador' })
                }
                else if (result) setCache(`utoken:${email}`, utoken)
                    .then(() => {

                        //@ts-ignore
                        req.utoken = utoken;
                        return next();
                    });
            })
            .catch((err: Error) => {



                console.error(err);
            })
    },

    async newUser(req: Request, res: Response, next: NextFunction) {
        const { email } = req.params;

        if (
            email === null ||
            email === undefined
        ) {
            return res.status(401).end()
        };

        if (!regexEP.email.test(email.trim().toLowerCase())) {



            return res.status(400).json({ message: 'Formato de e-mail inválido' })
        };

        const code = uuidv4().slice(0, 4).toUpperCase();

        //@ts-ignore
        await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then(
                async (result: any) => {
                    if (result) {
                        return res.status(400).json({ message: 'E-mail já está em uso', err: 'err_email409' })
                    }
                    else if (!result) {
                        const extendedCode = await getCache(`new-user:${email.trim().toLowerCase()}`);

                        if (extendedCode) return res.status(200).end();

                        await setCache(`new-user:${email.trim().toLowerCase()}`, code)
                            .then(() => {

                                //@ts-ignore
                                req.code = code;
                                return next();
                            });
                    }
                }
            )
            .catch((err: Error) => {



                console.error(err);
            })
    }
}

export default generateCode;