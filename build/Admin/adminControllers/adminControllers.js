"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../../models/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const transporter_1 = __importDefault(require("../../email/transporter"));
const adminNewUserOptions_1 = __importDefault(require("../../email/options/adminNewUserOptions"));
const regexEP_1 = __importDefault(require("../../functions/regexEP"));
const uuid_1 = require("uuid");
const adminGenerateToken_1 = __importDefault(require("../adminJwt/adminGenerateToken"));
/* Redis */
const redisConfig_1 = require("../../configs/cache/redisConfig");
const adminControllers = {
    async login(req, res) {
        const { password } = req.body;
        const refreshtoken = (0, uuid_1.v4)().slice(0, 8);
        //@ts-ignore
        await Users_1.default.findOne({
            where: { uid: 'admin' }
        })
            .then((user) => {
            if (user) {
                //@ts-ignore
                bcrypt_1.default.compare(password, user.password, async (err, resp) => {
                    if (err) {
                        console.error(err);
                        return res
                            .status(500)
                            .json({ message: 'E-mail ou senha invalidos' });
                    }
                    if (resp) {
                        //@ts-ignore
                        await Users_1.default.update({ refreshtoken }, { where: { uid: 'admin' } })
                            .catch((e) => {
                            console.error(e);
                            return res
                                .status(500)
                                .json({ message: 'refresh token error' });
                        });
                        return res.status(200).json({
                            //@ts-ignore
                            uid: user.uid,
                            //@ts-ignore
                            token: (0, adminGenerateToken_1.default)(user.uid, refreshtoken),
                        });
                    }
                    else {
                        return res.status(403).json({ message: 'E-mail ou senha incorretos' });
                    }
                });
            }
        })
            .catch((e) => {
            console.error(e);
            return res
                .status(500)
                .json({ message: 'login error' });
        });
    },
    async countUsers(req, res) {
        //@ts-ignore
        const count = await Users_1.default.count();
        return res.status(200).json(count);
    },
    async createNewUser(req, res, next) {
        const { adminPassword, randomPassword, name, email, description, profession } = req.body;
        //@ts-ignore 
        const uid = req.uid;
        if (uid !== 'admin')
            return res.status(403).json({ message: 'Usuário não é o administrador' });
        //@ts-ignore
        await Users_1.default.findOne({
            where: { uid: 'admin' }
        })
            .then((user) => {
            if (user === null)
                return res.status(404).json({ message: 'Administrador não foi encontrado' });
            //@ts-ignore
            bcrypt_1.default.compare(adminPassword, user.password, async (err, resp) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ message: 'Senha admin invalidos' });
                }
                else if (resp) {
                    if (randomPassword === null ||
                        randomPassword === undefined ||
                        typeof randomPassword !== 'string' ||
                        email == null ||
                        email == undefined ||
                        name === null ||
                        name === undefined)
                        return res.status(500).json({ message: 'Campos estão vazios' });
                    if (!regexEP_1.default.email.test(email.trim().toLowerCase()))
                        return res.status(400).json({ message: 'Formato de email invalido' });
                    if (randomPassword.length < 6)
                        return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
                    const uid = (0, uuid_1.v4)().slice(0, 10);
                    const salt = await bcrypt_1.default.genSalt(10);
                    const hash = await bcrypt_1.default.hash(randomPassword.toUpperCase().trim(), salt);
                    //@ts-ignore
                    await Users_1.default.create({
                        uid,
                        password: hash,
                        name,
                        email: email.toLowerCase().trim(),
                        description,
                        profession,
                        refreshtoken: null
                    })
                        .then(() => {
                        transporter_1.default.sendMail((0, adminNewUserOptions_1.default)(randomPassword, email), function (err, info) {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: 'erro do email ao criar um usuário pelo admin' });
                            }
                            else {
                                return res.status(200).json({ message: 'Usuário criado com sucesso pelo admin' });
                            }
                        });
                    })
                        .catch((e) => {
                        console.error(e);
                        let response = {
                            status: 500,
                            message: 'Erro ao inserir dados no banco de dados'
                        };
                        if (e.errors) {
                            switch (e.errors[0].message) {
                                case 'email must be unique':
                                    response = {
                                        status: 409,
                                        message: 'E-mail já esta cadastrado'
                                    };
                                    break;
                                case 'uid must be unique':
                                    response = {
                                        status: 409,
                                        message: 'uid must be unique'
                                    };
                                    break;
                                default:
                                    break;
                            }
                        }
                        return res
                            .status(response.status)
                            .json({ message: response.message });
                    });
                }
            });
        })
            .catch((e) => {
            console.error(e);
            return res
                .status(500)
                .json({ message: 'admin error' });
        });
    },
    async newExtendedCode(req, res, next) {
        const { email } = req.body;
        await (0, redisConfig_1.getCache)(`new-user:${email.trim().toLowerCase()}`)
            .then(async (code) => {
            const codeX = code
                ? code
                : (0, uuid_1.v4)().slice(0, 4).toUpperCase();
            await (0, redisConfig_1.setCache)(`new-user:${email.trim().toLowerCase()}`, codeX, 120 * 60);
            return res.status(200).json({ code: codeX });
        });
    }
};
exports.default = adminControllers;
