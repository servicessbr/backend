
require('dotenv').config();
const jwt = require('jsonwebtoken');
//const ErrorTransporter = require('../config/email/ErrorTransporter');

const Users = require("../models/Users");

const authorization = async (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    if (
        token === null ||
        token === undefined
    ) {

        //ErrorTransporter('AUTHx0001', 'no-log', { token }, req.originalUrl); // ----

        return res.sendStatus(401);
    };

    try {
        /*@ts-ignore*/
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {

        //ErrorTransporter('AUTHx0002', err, { token }, req.originalUrl); // ----

        return res.status(403).json({ message: 'invalide token' });
    }

    /*@ts-ignore*/
    const { uid, email, refreshtoken } = jwt.decode(token);

    if (uid === null) {

        //ErrorTransporter('AUTHx0003', 'no-log', { uid }, req.originalUrl); // ----

        return res.status(500).json({ message: 'null uid' })
    };
    if (refreshtoken === null) {

        //ErrorTransporter('AUTHx0004', 'no-log', { refreshtoken: refreshtoken }, req.originalUrl); // ----

        return res.status(500).json({ message: 'null refreshtoken' })
    };

    await Users.findOne({
        attributes: ['refreshtoken', 'blocked'],
        where: { uid }
    })
        .then((data) => {
            if (data === null) {

                //ErrorTransporter('AUTHx0005', 'no-log', {}, req.originalUrl); // ----

                return res.status(500).json({ message: 'auth user not found' })
            }

            else if (data.blocked) {

                //ErrorTransporter('AUTHx0007', 'no-log', {}, req.originalUrl); // ----

                return res.status(500).json({ message: 'Essa conta foi desativada por violar o art. ' + '12.6' })

            }

            /*
            else if (data.refreshtoken !== refreshtoken) {
                return res.status(403).json({ message: "invalid token" })
            }
            */
            else {
                /*@ts-ignore*/
                req.uid = uid;
                /*@ts-ignore*/
                req.email = email;
                return next();
            };

        })
        .catch((e) => {

            //ErrorTransporter('AUTHx0006', e, {}, req.originalUrl); // ----

            console.error(e)
            return res.status(500).json({ message: "token error" })
        })
}

module.exports = authorization;