
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { error } from 'console';
import { Request, Response } from 'express';

/* 
    * Services: 
*/
import generateToken from '../jwt/generateToken';

/* 
    * Models:
*/
import Users from '../models/Users';
import regexEP from '../functions/regexEP';
import { Sequelize } from 'sequelize';


const usersController = {
    /*
        * Bloqueia valores null;
        * Cria um refresh token e um user id único;
        * Insere um novo usuário.
    */
    async create(req: Request, res: Response) {
        const {
            password, name,
            email,
            description, profession
        }: any = req.body;

        if (
            password === null ||
            password === undefined ||
            typeof password !== 'string' ||
            email == null ||
            email == undefined ||
            name === null ||
            name === undefined
        ) {



            return res.status(500).json({ message: 'Campos estão vazios' })
        };

        if (!regexEP.email.test(email.trim().toLowerCase())) {



            return res.status(400).json({ message: 'Formato de email invalido' })
        };

        //if (
        //    (phone !== null) &&
        //    (phone !== undefined) &&
        //    (!regex.phone.test(phone))
        //) return res.status(400).json({ message: 'invalid phone format' });

        if (password.length < 6) {



            return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' })
        };

        const refreshtoken = uuidv4().slice(0, 8);
        const uid = new Date().getTime() + 'a2' + uuidv4().slice(0, 11);


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //@ts-ignore
        await Users.create({
            uid,
            password: hash,
            name,
            email: email.toLowerCase().trim(),
            description,
            profession,
            refreshtoken
        })
            .then((user: any) => {
                const token = generateToken(uid, user.email, user.name, refreshtoken);

                return res.status(200).json({
                    uid: user.uid,
                    name: user.name,
                    description: user.description,
                    profession: user.profession,
                    token
                })
            })
            .catch((e: any) => {
                error(e);

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
    },

    /*
        * Valida a senha;
        * Atualiza o refresh token;
        * Retorna os dados do usário.
    */
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const refreshtoken = uuidv4().slice(0, 8);

        if (typeof email !== 'string') {



            return res.status(500).json({ log: 'E-mail é diferente de "string"' })
        }

        //@ts-ignore
        await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        })
            .then((user: any) => {
                if (!user) {


                    return res.status(404).json({ message: 'E-mail não foi encontrado' })

                } else if (user && user.blocked) {


                    return res.status(404).json({ message: 'Essa conta foi desativada por violar o art. ' + '12.6' })

                } else if (user) {
                    bcrypt.compare(password, user.password, async (err, resp) => {
                        if (err) {
                            error(err);
                            return res
                                .status(500)
                                .json({ message: 'E-mail ou senha invalidos' })
                        }
                        if (resp) {
                            //@ts-ignore
                            await Users.update(
                                { refreshtoken },
                                { where: { email } }
                            )
                                .catch((e: Error) => {
                                    error(e);
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
                                vip: user.vip,
                                pro: user.pro,
                                token: generateToken(user.uid, user.email, user.name, refreshtoken),
                            });
                        } else {
                            return res.status(403).json({ message: 'E-mail ou senha incorretos' });
                        }
                    });
                }
            })
            .catch((e: Error) => {



                error(e);
                return res
                    .status(500)
                    .json({ message: 'login error' })
            });
    },

    /*
        * Atualiza o refresh token para NULL;
    */
    async logout(req: Request, res: Response) {

        //@ts-ignore
        const uid = req.uid;

        //@ts-ignore
        await Users.update(
            { refreshtoken: null },
            { where: { uid } }
        )
            .then(() => res.status(200).end())
            .catch((e: Error) => {

                error(e);
                return res.status(500).json({ message: 'logout error' })
            })
    },

    /*
        * Atualiza dados não sensíveis.
    */
    async update(req: Request, res: Response) {

        //@ts-ignore
        const uid = req.uid;

        const {
            name, phone,
            description, profession
        } = req.body;

        if (name === null) {
            return res.status(500).json({ message: 'Nome não pode estar vazio' })
        };

        //@ts-ignore
        await Users.update(
            {
                name,
                phone: regexEP.phone.test(phone) ? phone : null,
                description, profession
            },
            { where: { uid } }
        )
            .then(() => res.status(200).end())
            .catch((e: Error) => {
                error(e);
                return res.status(500).json({ message: 'user update error' })
            });
    },

    async delete(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid;
        const { password } = req.body;

        //@ts-ignore
        await Users.findOne({
            where: { uid }
        })
            .then((user: any) => {
                if (user === null) {
                    return res.status(404).json({ message: 'user not found' })
                };

                bcrypt.compare(password, user.password, async (err, resp) => {
                    if (err) {
                        error(err);
                        return res
                            .status(500)
                            .json({ message: 'compare error' })
                    }
                    if (resp) {
                        //@ts-ignore
                        await Users.destroy(
                            { where: { uid } }
                        )
                            .then(() => res.status(200).end())
                            .catch((e: Error) => {
                                error(e);
                                return res
                                    .status(500)
                                    .json({ message: 'destroy user error 1' })
                            });
                    } else {
                        return res.status(403).json({ message: 'Senha invalida' });
                    }
                });
            })
            .catch((e: Error) => {
                error(e);
                return res
                    .status(500)
                    .json({ message: 'destroy user error 2' })
            });
    },

    async load(req: Request, res: Response) {
        const { uid } = req.params;

        //@ts-ignore
        await Users.findOne({
            attributes: ['name', 'description', 'profession', 'uid', 'avatar'],
            where: { uid }
        })
            .then((user: any) => res.status(200).json(user))
            .catch((e: Error) => {
                error(e);
                return res.status(500).json({ message: 'load user error' });
            });
    },

    updates: {
        async password(req: Request, res: Response) {
            //@ts-ignore
            const email = req.email;
            const { password } = req.body;

            if (
                email == null ||
                email == undefined ||
                typeof password !== 'string'
            ) {
                return res.status(500).json({ message: 'empty filds' })
            };
            if (password.length < 6) {
                return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' })
            };

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            //@ts-ignore
            await Users.update(
                { password: hash },
                {
                    where: { email }
                }
            )
                .then(() => res.status(200).end())
                .catch((e: Error) => {
                    error(e);
                    return res.status(500).json({ message: 'change password error' });
                });
        }
    }
}

export default usersController;