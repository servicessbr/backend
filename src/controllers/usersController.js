
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Services:
const generateToken = require('../services/generateToken');

// Models:
const Users = require('../models/Users');
const regexEP = require('../services/regexEP');
const { Sequelize } = require('sequelize');
//const ErrorTransporter = require('../config/email/ErrorTransporter');

const usersController = {
    /*
        * Bloqueia valores null;
        * Cria um refresh token e um user id único;
        * Insere um novo usuário.
    */
    async create(req, res) {
        const {
            password, name,
            email,
            description, profession
        } = req.body;

        if (
            password === null ||
            password === undefined ||
            typeof password !== 'string' ||
            email == null ||
            email == undefined ||
            name === null ||
            name === undefined
        ) {

            //ErrorTransporter('UCTRLx0001', 'no-log', { name, email, profession }, req.originalUrl); // ----

            return res.status(500).json({ message: 'Campos estão vazios' })
        };

        if (!regexEP.email.test(email.trim().toLowerCase())) {

            //ErrorTransporter('UCTRLx0002', 'no-log', { email }, req.originalUrl); // ----

            return res.status(400).json({ message: 'Formato de email invalido' })
        };

        //if (
        //    (phone !== null) &&
        //    (phone !== undefined) &&
        //    (!regex.phone.test(phone))
        //) return res.status(400).json({ message: 'invalid phone format' });

        if (password.length < 6) {

            //ErrorTransporter('UCTRLx0003', 'no-log', {}, req.originalUrl); // ----

            return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' })
        };

        const refreshtoken = uuidv4().slice(0, 8);
        const uid = new Date().getTime() + 'a2' + uuidv4().slice(0, 11);


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await Users.create({
            uid,
            password: hash,
            name,
            email: email.toLowerCase().trim(),
            description,
            profession,
            refreshtoken
        })
            .then((user) => {
                const token = generateToken(uid, user.email, refreshtoken);

                return res.status(200).json({
                    uid: user.uid,
                    name: user.name,
                    description: user.description,
                    profession: user.profession,
                    token
                })
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

                //ErrorTransporter('UCTRLx0004', message, {}, req.originalUrl); // ----

                return res
                    .status(response.status)
                    .json({ message: response.message })
            });
    },

    /*
        * Valida a senha;
        * Atualiza o refresh token;
        * Retorna os dados do usário.
    */
    async login(req, res) {
        const { email, password } = req.body;

        const refreshtoken = uuidv4().slice(0, 8);

        if (typeof email !== 'string') {

            //ErrorTransporter('UCTRLx0005', 'no-log', { email }, req.originalUrl); // ----

            return res.status(500).json({ log: 'E-mail é diferente de "string"' })
        }

        await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then((user) => {
                if (!user) {

                    //ErrorTransporter('UCTRLx0006', 'no-log', { email }, req.originalUrl); // ----
                    return res.status(404).json({ message: 'E-mail não foi encontrado' })

                } else if (user && user.blocked) {

                    //ErrorTransporter('UCTRLx0022', 'no-log', { email }, req.originalUrl); // ----
                    return res.status(404).json({ message: 'Essa conta foi desativada por violar o art. ' + '12.6' })

                } else if (user) {
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
                                { where: { email } }
                            )
                                .catch((e) => {
                                    console.error(e);
                                    return res
                                        .status(500)
                                        .json({ message: 'refresh token error' })
                                });

                            return res.status(200).json({
                                uid: user.uid,
                                name: user.name,
                                description: user.description,
                                profession: user.profession,
                                phone: user.phone,
                                verified: user.verified,
                                avatar: user.avatar,
                                token: generateToken(user.uid, user.email, refreshtoken),
                            });
                        } else {

                            //ErrorTransporter('UCTRLx0007', 'no-log', {}, req.originalUrl); // ----

                            return res.status(403).json({ message: 'E-mail ou senha incorretos' });
                        }
                    });
                }
            })
            .catch((e) => {

                //ErrorTransporter('UCTRLx0008', e, { email }, req.originalUrl); // ----

                console.error(e);
                return res
                    .status(500)
                    .json({ message: 'login error' })
            });
    },

    /*
        * Atualiza o refresh token para NULL;
    */
    async logout(req, res) {
        /*@ts-ignore*/
        const uid = req.uid;

        await Users.update(
            { refreshtoken: null },
            { where: { uid } }
        )
            .then(() => res.sendStatus(200))
            .catch((e) => {
                //ErrorTransporter('UCTRLx0009', e, { uid }, req.originalUrl); // ----
                console.error(e);
                return res.status(500).json({ message: 'logout error' })
            })
    },

    /*
        * Atualiza dados não sensíveis.
    */
    async update(req, res) {
        /*@ts-ignore*/
        const uid = req.uid;

        const {
            name, phone,
            description, profession
        } = req.body;

        if (name === null) {

            //ErrorTransporter('UCTRLx0010', 'no-log', { name }, req.originalUrl); // ----

            return res.status(500).json({ message: 'Nome não pode estar vazio' })
        };

        await Users.update(
            {
                name,
                phone: regexEP.phone.test(phone) ? phone : null,
                description, profession
            },
            { where: { uid } }
        )
            .then(() => res.status(200).end())
            .catch((e) => {

                //ErrorTransporter('UCTRLx0011', e, {}, req.originalUrl); // ----

                console.error(e);
                return res.status(500).json({ message: 'user update error' })
            });
    },

    async delete(req, res) {
        /*@ts-ignore*/
        const uid = req.uid;
        const { password } = req.body;

        await Users.findOne({
            where: { uid }
        })
            .then((user) => {
                if (user === null) {

                    //ErrorTransporter('UCTRLx0012', 'no-log', { uid }, req.originalUrl); // ----

                    return res.status(404).json({ message: 'user not found' })
                };

                bcrypt.compare(password, user.password, async (err, resp) => {
                    if (err) {
                        console.error(err);

                        //ErrorTransporter('UCTRLx0013', err, { uid }, req.originalUrl); // ----

                        return res
                            .status(500)
                            .json({ message: 'compare error' })
                    }
                    if (resp) {
                        await Users.destroy(
                            { where: { uid } }
                        )
                            .then(() => res.sendStatus(200))
                            .catch((e) => {

                                //ErrorTransporter('UCTRLx0014', e, { uid }, req.originalUrl); // ----

                                console.error(e);
                                return res
                                    .status(500)
                                    .json({ message: 'destroy user error 1' })
                            });
                    } else {
                        return res.status(403).json({ message: 'Senha invalida' });
                    }
                });
            })
            .catch((e) => {

                //ErrorTransporter('UCTRLx0015', e, { uid: uid }, req.originalUrl); // ----

                console.error(e);
                return res
                    .status(500)
                    .json({ message: 'destroy user error 2' })
            });
    },

    async load(req, res) {

        const { uid } = req.params;

        await Users.findOne({
            attributes: ['name', 'description', 'profession', 'uid', 'verified', 'avatar', 'partner'],
            where: { uid }
        })
            .then((user) => res.status(200).json(user))
            .catch((e) => {


                //ErrorTransporter('UCTRLx0015', e, { uid }, req.originalUrl); // ----

                console.error(e);
                return res.status(500).json({ message: 'load user error' });
            });
    },

    updates: {
        async password(req, res) {
            /*@ts-ignore*/
            const email = req.email;
            const { password } = req.body;

            if (
                email == null ||
                email == undefined ||
                typeof password !== 'string'
            ) {

                //ErrorTransporter('UCTRLx0016', 'no-log', { email }, req.originalUrl); // ----

                return res.status(500).json({ message: 'empty filds' })
            };
            if (password.length < 6) {

                //ErrorTransporter('UCTRLx0017', 'no-log', {}, req.originalUrl); // ----

                return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' })
            };

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            await Users.update(
                { password: hash },
                {
                    where: { email }

                }
            )
                .then(() => res.status(200).end())
                .catch((e) => {

                    //ErrorTransporter('UCTRLx0018', e, { email }, req.originalUrl); // ----

                    console.error(e);
                    return res.status(500).json({ message: 'change password error' });
                });
        },

        async phone(req, res) {
            /*@ts-ignore*/
            const uid = req.uid;

            const { phone } = req.body;

            if (!regexEP.phone.test(phone)) {

                //ErrorTransporter('UCTRLx0019', 'no-log', { uid, phone }, req.originalUrl); // ----

                return res.status(400).json({ message: 'Formato de telefone invalido' })
            };

            await Users.update(
                { phone },
                { where: { uid } }
            )
                .then(() => res.status(200).end())
                .catch((e) => {

                    //ErrorTransporter('UCTRLx0020', e, { uid, phone }, req.originalUrl); // ----

                    console.error(e);
                    return res.status(500).json({ message: 'Error ao atualizar o telefone' })
                });
        },
    },
    async partner(req, res) {

        await Users.findAll({
            attributes: ['name', 'profession', 'uid', 'verified', 'avatar'],
            where: { partner: true, avatar: true },
            limit: 9,
            order: Sequelize.literal('random()')
        })
            .then((user) => res.status(200).json(user))
            .catch((e) => {
                console.error(e);
                return res.status(500).json({ message: 'load user error' });
            });
    },
    /*
        async haveAvatar(req:Request, res:Response) {
            const { uid } = req.params;
    
            await Users.findOne({
                attributes: ['avatar'],
                where: { uid }
            })
                .then(user => res.status(200).json(user))
                .catch((e:Error) => {
    
                    //ErrorTransporter('UCTRLx0021', e, { uid }, req.originalUrl); // ----
    
                    console.error(e);
                    return res.status(500).json({ message: 'load user error' });
                });
        }, 
        */
}

module.exports = usersController;