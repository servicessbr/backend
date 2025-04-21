
import 'dotenv/config';
const jwt = require('jsonwebtoken');
const regexEP = require('../../functions/regexEP');
import { v4 as uuidv4 } from 'uuid';

/* 
    * Radis 
*/
const { setCache, getCache } = require('../../../public/config/redisConfig');


/* 
    * Models:
*/
const Users = require('../../models/Users');


const generateCode = {
    /* 
        *Alterar qualquer dado sensível do usuário (ex:senha, email, telefone).
    */
    async utoken(req: Request, res: Response, next: NextFunction) {
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

            process.env.URL_TOKEN,
            { expiresIn: 10 * 60 }
        );

        await Users.findOne({
            where: { email }
        })
            .then((result) => {
                if (!result) {



                    return res.status(400).json({ message: 'E-mail não foi encontrador' })
                }
                else if (result) setCache(`utoken:${email}`, utoken)
                    .then(() => {

                        req.utoken = utoken;
                        return next();
                    });
            })
            .catch((err) => {



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

        await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then(
                async (result) => {
                    if (result) {
                        return res.status(400).json({ message: 'E-mail já está em uso', err: 'err_email409' })
                    }
                    else if (!result) {
                        const extendedCode = await getCache(`new-user:${email.trim().toLowerCase()}`);

                        if (extendedCode) return res.status(200).end();

                        await setCache(`new-user:${email.trim().toLowerCase()}`, code)
                            .then(() => {

                                req.code = code;
                                return next();
                            });
                    }
                }
            )
            .catch((err) => {



                console.error(err);
            })
    }
}

export default generateCode;