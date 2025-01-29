
require('dotenv').config();
const jwt = require('jsonwebtoken');
const regexEP = require('../../services/regexEP');
const { v4: uuidv4 } = require('uuid');

/* Radis */
const { setCache, getCache } = require('../../config/redisConfig');


// Models:
const Users = require('../../models/Users');
//const ErrorTransporter = require('../../config/email/ErrorTransporter');

const generateCode = {
    // Alterar qualquer dado sensível do usuário (ex:senha, email, telefone).
    async utoken(req, res, next) {
        /*@ts-ignore*/
        const email = req.email;

        if (
            email === null ||
            email === undefined
        ) {

            //ErrorTransporter('GCx0001', 'no-log', { email }, req.originalUrl); // ----

            return res.status(401).end()
        };

        if (!regexEP.email.test(email.trim().toLowerCase())) {

            //ErrorTransporter('GCx0002', 'no-log', { email }, req.originalUrl); // ----

            return res.status(400).json({ message: 'invalid email format' })
        };

        const utoken = jwt.sign(
            { email },
            /*@ts-ignore*/
            process.env.URL_TOKEN,
            { expiresIn: 10 * 60 }
        );

        await Users.findOne({
            where: { email }
        })
            .then((result) => {
                if (!result) {

                    //ErrorTransporter('GCx0004', 'no-log', { email }, req.originalUrl); // ----

                    return res.status(400).json({ message: 'E-mail não foi encontrador' })
                }
                else if (result) setCache(`utoken:${email}`, utoken)
                    .then(() => {
                        /*@ts-ignore*/
                        req.utoken = utoken;
                        return next();
                    });
            })
            .catch((err) => {

                //ErrorTransporter('GCx0005', err, { email }, req.originalUrl); // ----

                console.error(err);
            })
    },

    async newUser(req, res, next) {
        const { email } = req.params;

        if (
            email === null ||
            email === undefined
        ) {

            //ErrorTransporter('GCx0006', 'no-log', { email }, req.originalUrl); // ----

            return res.status(401).end()
        };

        if (!regexEP.email.test(email.trim().toLowerCase())) {

            //ErrorTransporter('GCx0007', 'no-log', { email }, req.originalUrl); // ----

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
                                /*@ts-ignore*/
                                req.code = code;
                                return next();
                            });
                    }
                }
            )
            .catch((err) => {

                //ErrorTransporter('GCx0009', err, { email }, req.originalUrl); // ----

                console.error(err);
            })
    }
}

module.exports = generateCode;