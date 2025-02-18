const removeNotDigitsFromString = require("../functions/onlyDigits/removeNotDigitsFromString");
const regexEP = require("../functions/regexEP");
const Users = require("../models/Users");
const { error } = require('console');

async function updatePhone(req, res, next) {
    const uid = req.uid;
    const { phone } = req.body;

    if (!(phone && uid)) return next();

    const phoneNumber = removeNotDigitsFromString(phone);

    if (regexEP.phone.test(phoneNumber)) await Users.update(
        { phone: phoneNumber },
        { where: { uid } }
    )
        .then(() => res.set('X-updated-phone', true))
        .catch(err => error(err));
    /*
        * Informa o client que o phone foi alterado.
    */


    return next();
}

module.exports = updatePhone;