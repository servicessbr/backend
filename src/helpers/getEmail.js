//const ErrorTransporter = require('../../config/email/ErrorTransporter');
 
const Users = require('../models/Users');

const getEmail = async (req, res, next) => {

    const { prof_uid } = req.body;

    await Users.findOne({
        attributes: ['email', "name"],
        where: { uid: prof_uid }
    })
        .then((user) => {
            if (user === null) {

                //ErrorTransporter('GETEMx0001', 'no-log', { prof_uid }, req.originalUrl); // ----

                return res.status(404).json({ message: 'send message user not found' })
            };
            /*@ts-ignore*/
            req.prof_email = user.email;
            /*@ts-ignore*/
            req.prof_name = user.name;
            next();
        })
        .catch((e) => {

            //ErrorTransporter('GETEMx0002', e, { prof_uid }, req.originalUrl); // ----

            console.error(e);
            return res
                .status(500)
                .json({ message: 'send message error' })
        });
}

module.exports = getEmail;