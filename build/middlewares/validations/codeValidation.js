"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../../models/Users"));
const console_1 = require("console");
const redisConfig_1 = require("../../configs/cache/redisConfig");
const codeValidation = {
    async utoken(req, res, next) {
        const auth = req.headers.authorization;
        const tocompare = auth && auth.split(' ')[1];
        if (tocompare === null ||
            tocompare === undefined) {
            return res.status(401).end();
        }
        try {
            jsonwebtoken_1.default.verify(tocompare, process.env.URL_TOKEN);
        }
        catch (err) {
            (0, console_1.error)(err);
            return res.status(403).json({ message: 'invalide utoken' });
        }
        //@ts-ignore
        const { email } = jsonwebtoken_1.default.decode(tocompare);
        await (0, redisConfig_1.getCache)(`utoken:${email}`)
            .then((utoken) => {
            if (utoken === null) {
                return res.status(404).json({ message: 'cache not found' });
            }
            else if (utoken === tocompare) {
                //@ts-ignore
                req.email = email;
                return next();
            }
            else {
                return res.status(401).json({ message: 'utoken do not match' });
            }
            ;
        });
    },
    async newUser(req, res, next) {
        const { email, tocompare } = req.body;
        // Verifica de novo se já existe um usuário com esse e-mail:
        //@ts-ignore
        await Users_1.default.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then(async (result) => {
            // Se já tiver, manda o código de error de conflito para o client:
            if (result) {
                return res.status(400).json({ message: 'E-mail já está em uso', err: 'err_email409' });
            }
            else if (!result) {
                // Se não tiver e...
                await (0, redisConfig_1.getCache)(`new-user:${email.trim().toLowerCase()}`)
                    .then((code) => {
                    // ..não econtrar, um código é pq expirou, encerra aqui:
                    if (code === null) {
                        return res.status(404).json({ message: 'cache not found' });
                    }
                    // ...encontrar, o código é comparado, sendo igual passa para a rota de criação de um novo usuário:
                    if (code === tocompare)
                        return next();
                    else {
                        return res.status(401).json({ message: 'code do not match' });
                    }
                    ;
                });
            }
        })
            .catch((err) => {
            console.error(err);
        });
    }
};
exports.default = codeValidation;
