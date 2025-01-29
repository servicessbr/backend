
require('dotenv').config();
const jwt = require('jsonwebtoken');
//const ErrorTransporter = require( '../../config/email/ErrorTransporter');
const { getCache } = require('../../config/redisConfig');
const Users = require('../../models/Users');


const codeValidation = {
    async utoken(req, res, next) {
        const auth = req.headers.authorization;
        const tocompare = auth && auth.split(' ')[1];

        if (
            tocompare === null ||
            tocompare === undefined
        ) {
            //ErrorTransporter('CVx0001', 'no-log', { tocompare }, req.originalUrl); // ----

            return res.sendStatus(401);
        }

        try {
            /*@ts-ignore*/
            jwt.verify(tocompare, process.env.URL_TOKEN);
        } catch (err) {
            //ErrorTransporter('CVx0002', err, { tocompare }, req.originalUrl); // ----

            return res.status(403).json({ message: 'invalide utoken' });
        }

        /*@ts-ignore*/
        const { email } = jwt.decode(tocompare);

        await getCache(`utoken:${email}`)
            .then(utoken => {
                if (utoken === null) {

                    //ErrorTransporter('CVx0003', 'no-log', { utoken, email }, req.originalUrl);

                    return res.status(404).json({ message: 'cache not found' })
                }
                else if (utoken === tocompare) {
                    /*@ts-ignore*/
                    req.email = email;
                    return next();
                }
                else {

                    //ErrorTransporter('CVx0004', 'no-log', { utoken }, req.originalUrl); // ----

                    return res.status(401).json({ message: 'utoken do not match' })
                };
            });
    },

    async newUser(req, res, next) {
        const { email, tocompare } = req.body;

        // Verifica de novo se já existe um usuário com esse e-mail:
        await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then(async (result) => {
                // Se já tiver, manda o código de error de conflito para o client:
                if (result) {
                    return res.status(400).json({ message: 'E-mail já está em uso', err: 'err_email409' })
                }
                else if (!result) {
                    // Se não tiver e...
                    await getCache(`new-user:${email.trim().toLowerCase()}`)
                        .then(code => {
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
            .catch((err) => {
                console.error(err);
            })
    }
}

module.exports = codeValidation;