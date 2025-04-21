
import 'dotenv/config';
import jwt from 'jsonwebtoken';


import Users from '../../models/Users';
import { error } from 'console';
import { Request, Response, NextFunction } from 'express';
import { getCache } from '../../configs/cache/redisConfig';


const codeValidation = {
    async utoken(req: Request, res: Response, next: NextFunction) {
        const auth = req.headers.authorization;
        const tocompare = auth && auth.split(' ')[1];

        if (
            tocompare === null ||
            tocompare === undefined
        ) {
            return res.status(401).end();
        }

        try {
            jwt.verify(tocompare, process.env.URL_TOKEN as string);
        } catch (err) {
            error(err)
            return res.status(403).json({ message: 'invalide utoken' });
        }


        //@ts-ignore
        const { email } = jwt.decode(tocompare);

        await getCache(`utoken:${email}`)
            .then((utoken:any) => {
                if (utoken === null) {



                    return res.status(404).json({ message: 'cache not found' })
                }
                else if (utoken === tocompare) {

                    //@ts-ignore
                    req.email = email;
                    return next();
                }
                else {



                    return res.status(401).json({ message: 'utoken do not match' })
                };
            });
    },

    async newUser(req: Request, res: Response, next: NextFunction) {
        const { email, tocompare } = req.body;

        // Verifica de novo se já existe um usuário com esse e-mail:
        //@ts-ignore
        await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then(async (result:any) => {
                // Se já tiver, manda o código de error de conflito para o client:
                if (result) {
                    return res.status(400).json({ message: 'E-mail já está em uso', err: 'err_email409' })
                }
                else if (!result) {
                    // Se não tiver e...
                    await getCache(`new-user:${email.trim().toLowerCase()}`)
                        .then((code:any) => {
                            // ..não econtrar, um código é pq expirou, encerra aqui:
                            if (code === null) {
                                return res.status(404).json({ message: 'cache not found' })
                            }
                            // ...encontrar, o código é comparado, sendo igual passa para a rota de criação de um novo usuário:
                            if (code === tocompare) return next();
                            else {
                                return res.status(401).json({ message: 'code do not match' })
                            };
                        });
                }
            })
            .catch((err:Error) => {
                console.error(err);
            })
    }
}

export default codeValidation;