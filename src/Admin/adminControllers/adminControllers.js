const Users = require("../../models/Users");

const bcrypt = require("bcrypt");
const transporter = require('../../email/transporter');
const adminNewUserOptions = require('../../email/options/adminNewUserOptions');
const regexEP = require("../../services/regexEP");
const { v4: uuidv4 } = require('uuid');
const adminGenerateToken = require("../adminServices/adminGenerateToken");


/* Redis */
const { getCache, setCache } = require("../../../public/config/redisConfig");

const adminControllers = {
    async login(req, res) {
        const { password } = req.body;

        const refreshtoken = uuidv4().slice(0, 8);

        await Users.findOne({
            where: { uid: 'admin' }
        })
            .then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password, async (err, resp) => {
                        if (err) {
                            console.error(err);
                            return res
                                .status(500)
                                .json({ message: 'E-mail ou senha invalidos' })
                        }
                        if (resp) {
                            await Users.update(
                                { refreshtoken },
                                { where: { uid: 'admin' } }
                            )
                                .catch((e) => {
                                    console.error(e);
                                    return res
                                        .status(500)
                                        .json({ message: 'refresh token error' })
                                });

                            /*let d = new Date();
                            transporter.sendMail({
                                from: 'Servicess <suporte@servicess.com.br>',
                                to:'suporte@servicess.com.br',
                                subject: 'loggin as admin!',
                                html: 'Loggin as admin ' + d
                            }, function (err, info) {
                                if (err) {
                                    console.error(err)
                                    return res.status(500).json({ message: 'erro do email ao criar um usuário pelo admin' })
                                } else {
                                    return res.status(200).json({
                                        uid: user.uid,
                                        token: adminGenerateToken(user.uid, refreshtoken),
                                    });
                                }
                            });*/
                            return res.status(200).json({
                                uid: user.uid,
                                token: adminGenerateToken(user.uid, refreshtoken),
                            });
                        } else {
                            return res.status(403).json({ message: 'E-mail ou senha incorretos' });
                        }
                    });
                }
            })
            .catch((e) => {
                console.error(e);
                return res
                    .status(500)
                    .json({ message: 'login error' })
            });
    },
    async countUsers(req, res) {
        const count = await Users.count();
        return res.status(200).json(count);
    },
    async createNewUser(req, res, next) {
        const {
            adminPassword, randomPassword,
            name,
            email,
            description, profession
        } = req.body;

         
        const uid = req.uid;

        if (uid !== 'admin') return res.status(403).json({ message: 'Usuário não é o administrador' })

        await Users.findOne({
            where: { uid: 'admin' }
        })
            .then((user) => {
                if (user === null) return res.status(404).json({ message: 'Administrador não foi encontrado' });

                bcrypt.compare(adminPassword, user.password, async (err, resp) => {
                    if (err) {
                        console.error(err);
                        return res
                            .status(500)
                            .json({ message: 'Senha admin invalidos' })
                    }
                    else if (resp) {
                        if (
                            randomPassword === null ||
                            randomPassword === undefined ||
                            typeof randomPassword !== 'string' ||
                            email == null ||
                            email == undefined ||
                            name === null ||
                            name === undefined
                        ) return res.status(500).json({ message: 'Campos estão vazios' });

                        if (!regexEP.email.test(email.trim().toLowerCase()))
                            return res.status(400).json({ message: 'Formato de email invalido' });

                        if (randomPassword.length < 6) return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });

                        const uid = uuidv4().slice(0, 10);

                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(randomPassword.toUpperCase().trim(), salt);

                        await Users.create({
                            uid,
                            password: hash,
                            name,
                            email: email.toLowerCase().trim(),
                            description,
                            profession,
                            refreshtoken: null
                        })
                            .then(() => {
                                transporter.sendMail(adminNewUserOptions(randomPassword, email), function (err, info) {
                                    if (err) {
                                        console.error(err)
                                        return res.status(500).json({ message: 'erro do email ao criar um usuário pelo admin' })
                                    } else {
                                        return res.status(200).json({ message: 'Usuário criado com sucesso pelo admin' })
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
                                            }
                                            break;

                                        case 'uid must be unique':
                                            response = {
                                                status: 409,
                                                message: 'uid must be unique'
                                            }
                                            break;

                                        default:
                                            break;
                                    }
                                }
                                return res
                                    .status(response.status)
                                    .json({ message: response.message })
                            });
                    }
                });
            })
            .catch((e) => {
                console.error(e);
                return res
                    .status(500)
                    .json({ message: 'admin error' })
            });
    },

    async newExtendedCode(req, res, next) {
        const { email } = req.body;

        await getCache(`new-user:${email.trim().toLowerCase()}`)
            .then(async (code) => {
                const codeX = code
                    ? code
                    : uuidv4().slice(0, 4).toUpperCase();

                await setCache(`new-user:${email.trim().toLowerCase()}`, codeX, 120 * 60);
                return res.status(200).json({ code: codeX })
            });
    }

}

module.exports = adminControllers;