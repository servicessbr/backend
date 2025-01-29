//const regex = require("../services/regex");
const convertEmail = (req, res, next) => {
    /* Converte o email que vem dos "params" para "locals" */
    const { email } = req.params;
    /*@ts-ignore*/
    req.email = email;
    next();
}

module.exports = convertEmail;