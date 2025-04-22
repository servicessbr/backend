"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertEmail = (req, res, next) => {
    /*
        * Converte o email que vem dos "params" para "locals"
    */
    const { email } = req.params;
    //@ts-ignore
    req.email = email;
    next();
};
exports.default = convertEmail;
