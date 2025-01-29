const Users = require("../../models/Users");
const Verifications = require("../../models/Verifications");
const bcrypt = require("bcrypt");
const transporter = require('../../config/email/transporter');
const adminNewUserOptions = require('../../config/email/options/adminNewUserOptions');
const regexEP = require("../../services/regexEP");
const { v4: uuidv4 } = require('uuid');
//const Verify = require( "../../schemas/Verify");
//const cpf = require( "../../functions/cpf");
const adminGenerateToken = require("../adminServices/adminGenerateToken");
//const verifyOptions = require( "../../config/email/options/verifyOptions");
const partnerOptions = require('../../config/email/options/partnerOptions');

/* Redis */
const { getCache, setCache } = require("../../config/redisConfig");
const ServiceOrderIntention = require("../../schemas/ServiceOrderIntention");

const adminControllers = {
    async login(req, res) {

        /*@ts-ignore*/
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
    async countdown(req, res) {
        const count = await Users.count();
        const countdown = 100000 - (count - 10);
        return res.status(200).json(countdown);
    },
    async createNewUser(req, res, next) {
        const {
            adminPassword, randomPassword,
            name,
            email,
            description, profession
        } = req.body;

        /*@ts-ignore*/
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

                        //if (
                        //    (phone !== null) &&
                        //    (phone !== undefined) &&
                        //    (!regexEP.phone.test(phone))
                        //) return res.status(400).json({ message: 'invalid phone format' });

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

    verified: {
        async make(req, res) {
            const { uid, document, deny } = req.body;

            if (!cpf(document)) {
                return res.status(403).json({ msg: 'CPF invalido' });
            }

            const user = await Users.findOne({
                attributes: ['email', 'document', 'name'],
                where: { uid }
            })

            if (user && user.document) return res.status(500).json({ message: 'Documento já foi registrado' });

            if (!deny) await Users.update(
                {
                    uid,
                    document,
                    verified: true
                },
                { where: { uid } }
            ).catch((err) => console.error(err));

            Verify.deleteOne({ where: { uid } }, (err) => {
                if (err)
                    throw err;
                else {
                    if (user && user.email && regexEP.email.test(user.email.trim().toLowerCase())) {
                        transporter.sendMail(verifyOptions(
                            user.email,
                            deny ? 'failure' : 'success',
                            {
                                uid,
                                name: user.name
                            }
                        ), function (err, info) {
                            if (err) {
                                console.error(err)
                                return res.status(500).json({ message: 'erro do email ao verificar um usuário pelo admin' })
                            } else {
                                return res.status(200).end();
                            }
                        });
                    } else return res.status(500).json({ log: 'formato de email invalido ao verificar um usuário pelo admin' })
                }
            })
        },

        async create(req, res) {

            const { uid, document } = req.body;

            if (!uid || !document) return res.status(403).json({ log: 'data missing verifiy create' })
            if (!cpf(document)) return res.status(403).json({ msg: 'CPF invalido' });

            const verify = await Verify.find({ uid });

            if (!verify.length) await Verify.create({
                uid,
                document,

                images: req.filenames
            })
                .then(() => res.send('OK'))
                .catch(error => {
                    console.error(error);
                    return res.status(500).end();
                })

            else return res.status(409).json({ message: 'Record already exists' }) //se alterar essa mensagem tem que alterar o frontend > VerifyProfile.tsx

        },

        async list(req, res) {
            await Verify.find({})
                .then((data) => {
                    return res.status(200).json({
                        count: data.length,
                        user: Array.isArray(data) && data[0]
                    })
                })
        }
    },
    async partnerMake(req, res) {
        const { uid } = req.body;

        await Users.update(
            { partner: true },
            {
                where: { uid },
                returning: ['name', 'email'],
                plain: true
            }
        )
            .then((result) => {

                if (!(
                    result &&
                    result[1] &&
                    result[1].dataValues
                )) return res.status(204).end();

                const email = result[1].dataValues.email;
                const name = result[1].dataValues.name;

                if (name && email && regexEP.email.test(email.trim().toLowerCase())) {
                    transporter.sendMail(partnerOptions(name, email), function (err, info) {
                        if (err) {
                            console.error(err)
                            return res.status(500).json({ message: 'erro do email ao validar o parceiro pelo admin' })
                        } else {
                            return res.status(200).end();
                        }
                    });
                }

            })
            .catch(() => res.status(500).end())
    },

    async deleteVerification(req, res) {

        const { user_uid } = req.body;

        if (!user_uid) return;

        await Verifications.destroy(
            { where: { user_uid } }
        )
            .then(() => res.status(200).end())
            .catch((e) => {

                //ErrorTransporter('UCTRLx0014', e, { uid }, req.originalUrl); // ----

                console.error(e);
                return res
                    .status(500)
                    .json({ message: 'destroy verification error 1' })
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
    },

    async listServiceOrderMongoDB(req, res) {
        const mongoResponse = await ServiceOrderIntention.find({adminMark: {$ne: true}});

        const mongoR = mongoResponse.map(it => [it.client_uid, it.prof_uid]);

        const phones = await Users.findAll({
            where: {
                uid: [...new Set(mongoR.flat(1))],
            },
            attributes: ['uid', 'phone'],
            raw: true,
            subQuery: false
        })



        const finalList = mongoResponse.map((i) => {
            return {
                so_unique_id: '1734146187107ada2',
                unique_id: i.unique_id,
                client_uid: i.client_uid,
                client_name: i.client_name,
                client_email: i.client_email,
                client_phone: phones.find(p => p.uid === i.client_uid).phone,
                prof_uid: i.prof_uid,
                prof_name: i.prof_name,
                prof_email: i.prof_email,
                prof_phone: phones.find(p => p.uid === i.prof_uid).phone,
                work_ref: i.work_ref,
                work_title: i.work_title,
                status: i.status,
                ser_description: i.ser_description,
                loc_place: i.loc_place,
                date_hours: i.date_hours,
                date_month: i.date_month,
                date_day: i.date_day,
                date_week: i.date_week,
                price: i.price,
                pix: i.pix

            }
        })



        return res.status(200).json(finalList)
    },

    async markSOMongo(req, res) {
        const { unique_id } = req.body;

        const intention = await ServiceOrderIntention.findOne({ unique_id });

        intention.adminMark = true;

        console.log('intention: ', intention)

        intention.save()
            .then((r) => {
                console.log(r)

                return res.status(200).end()
            })
            .catch(err => {
                console.error(err)

                return res.status(500).json({message: 'Erro so admin mark'})
            })


    }

}

module.exports = adminControllers;