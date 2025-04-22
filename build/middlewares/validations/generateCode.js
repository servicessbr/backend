"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const regexEP_1 = __importDefault(require("../../functions/regexEP"));
const uuid_1 = require("uuid");
/*
    * Models:
*/
const Users_1 = __importDefault(require("../../models/Users"));
//import { Result } from 'ioredis';
const redisConfig_1 = require("../../configs/cache/redisConfig");
const generateCode = {
    /*
        *Alterar qualquer dado sensível do usuário (ex:senha, email, telefone).
    */
    async utoken(req, res, next) {
        //@ts-ignore
        const email = req.email;
        if (email === null ||
            email === undefined) {
            return res.status(401).end();
        }
        ;
        if (!regexEP_1.default.email.test(email.trim().toLowerCase())) {
            return res.status(400).json({ message: 'invalid email format' });
        }
        ;
        const utoken = jsonwebtoken_1.default.sign({ email }, process.env.URL_TOKEN, { expiresIn: 10 * 60 });
        //@ts-ignore
        await Users_1.default.findOne({
            where: { email }
        })
            .then((result) => {
            if (!result) {
                return res.status(400).json({ message: 'E-mail não foi encontrador' });
            }
            else if (result)
                (0, redisConfig_1.setCache)(`utoken:${email}`, utoken)
                    .then(() => {
                    //@ts-ignore
                    req.utoken = utoken;
                    return next();
                });
        })
            .catch((err) => {
            console.error(err);
        });
    },
    async newUser(req, res, next) {
        const { email } = req.params;
        if (email === null ||
            email === undefined) {
            return res.status(401).end();
        }
        ;
        if (!regexEP_1.default.email.test(email.trim().toLowerCase())) {
            return res.status(400).json({ message: 'Formato de e-mail inválido' });
        }
        ;
        const code = (0, uuid_1.v4)().slice(0, 4).toUpperCase();
        //@ts-ignore
        await Users_1.default.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then(async (result) => {
            if (result) {
                return res.status(400).json({ message: 'E-mail já está em uso', err: 'err_email409' });
            }
            else if (!result) {
                const extendedCode = await (0, redisConfig_1.getCache)(`new-user:${email.trim().toLowerCase()}`);
                if (extendedCode)
                    return res.status(200).end();
                await (0, redisConfig_1.setCache)(`new-user:${email.trim().toLowerCase()}`, code)
                    .then(() => {
                    //@ts-ignore
                    req.code = code;
                    return next();
                });
            }
        })
            .catch((err) => {
            console.error(err);
        });
    }
};
exports.default = generateCode;
