"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const console_1 = require("console");
/*
    * Models:
*/
const Works_1 = __importDefault(require("../models/Works"));
const Subworks_1 = __importDefault(require("../models/Subworks"));
const stringContainsOnlyDigits_1 = __importDefault(require("../functions/onlyDigits/stringContainsOnlyDigits"));
const Internationals_1 = __importDefault(require("../models/Internationals"));
const insertableSubworks = (subworks, work_id) => {
    /*
        * Acrescenta o ID do anúncio( work ) como foreign key
        * Se tiver, remove o capo ID para não ter conflito com o
        * ID gerado automaticamente.
    */
    if (Array.isArray(subworks))
        return subworks.map(it => {
            delete it.id;
            return { ...it, work_id };
        });
    else
        return [];
};
const worksController = {
    async create(req, res) {
        //@ts-ignore
        const uid = req.uid;
        const { title, description, price, city_id, subworks, internationals } = req.body;
        const isInternationalRequest = (internationals &&
            typeof internationals.country === 'string' &&
            internationals.country.length === 2);
        //console.log('isInternationalRequest', isInternationalRequest);
        if (!(city_id || isInternationalRequest))
            return res
                .status(500)
                .json({ message: 'Por favor escolha uma cidade e estado' });
        if (!title)
            return res
                .status(500)
                .json({ message: 'Por favor defina o nome do serviço' });
        if (!price)
            return res
                .status(500)
                .json({ message: 'Por favor defina o preço do serviço' });
        if (!((0, stringContainsOnlyDigits_1.default)(price)))
            return res
                .status(500)
                .json({ message: 'O preço deve ter apenas números' });
        //@ts-ignore
        const work = await Works_1.default.create({
            user_uid: uid,
            title,
            description,
            city_id: isInternationalRequest ? 0 : city_id,
            price: parseInt(price),
        }).catch(err => {
            (0, console_1.error)(err);
            return res
                .status(500)
                .json({ message: 'create work error' });
        });
        /*
            * Se tiver uma lista de subworks cria a tabela subworks:
        */
        if (Array.isArray(subworks)) {
            const insertSubWorks = insertableSubworks(subworks, work.id);
            //@ts-ignore
            await Subworks_1.default.bulkCreate(insertSubWorks)
                .catch((err) => (0, console_1.error)(err));
        }
        //console.log(internationals);
        /*
            * Se for internacional cria a table internacional:
        */
        if (isInternationalRequest) {
            //@ts-ignore
            await Internationals_1.default.create({
                work_id: work.id,
                country: internationals.country.toLowerCase(),
                state: internationals.state,
                city: internationals.city,
            })
                .catch((err) => (0, console_1.error)(err));
        }
        return res.status(200).json({ work_id: work.id });
    },
    async update(req, res) {
        /*
            * Confere se tem algum dado para ser alterado
            * ou ta vazia.
        */
        if (!Object.keys(req.body).length)
            return res
                .status(204)
                .end();
        const { work_id } = req.body;
        const { work, subworks } = req.body;
        (work && Object.keys(work).length) &&
            //@ts-ignore
            await Works_1.default.update(work, {
                status: ['title', 'description', 'price'],
                where: { id: work_id }
            })
                .catch(err => (0, console_1.error)(err));
        (subworks && Array.isArray(subworks)) &&
            //@ts-ignore
            Subworks_1.default.destroy({
                where: { work_id }
            })
                .then(async () => {
                const insertSubWorks = insertableSubworks(subworks, work_id);
                //@ts-ignore
                await Subworks_1.default.bulkCreate(insertSubWorks)
                    .catch(err => (0, console_1.error)(err));
            })
                .catch(err => (0, console_1.error)(err));
        return res.status(200).end();
    },
    async load(req, res) {
        const { work_id } = req.params;
        //@ts-ignore
        const vip = req.vip;
        if (!((0, stringContainsOnlyDigits_1.default)(work_id)))
            return res
                .status(500)
                .json({ message: 'error - work_id is not a number' });
        const sendPhone = vip ? 'users.phone as phone, ' : ' ';
        //@ts-ignore
        const works = await Works_1.default.sequelize.query(`SELECT 
            works.id, works.title, works.description, 
            works.price, works.city_id, works.user_uid,
            users.name as user_name, users.profession as user_profession, 
            users.description as user_description,
            ${sendPhone} 
            cities.name as city, states.name as state
            FROM works 
            INNER JOIN users 
            ON (works.user_uid = users.uid) 
            INNER JOIN cities 
            ON (works.city_id = cities.id) 
            INNER JOIN states 
            ON (cities.state_id = states.id) 
            WHERE (works.id = :work_id) 
            LIMIT 1;`, {
            replacements: { work_id },
            type: sequelize_1.QueryTypes.SELECT
        }).catch(err => (0, console_1.error)(err));
        if (!works)
            return res
                .status(200)
                .json({ message: 'load works error' });
        //@ts-ignore
        const subworks = await Subworks_1.default.findAll({
            attributes: ['id', 'title', 'description', 'price'],
            where: { work_id }
        }).catch(err => (0, console_1.error)(err));
        if (!Array.isArray(subworks))
            return res
                .status(200)
                .json({ message: 'load subworks error' });
        return res
            .status(200)
            .json({
            work: works[0],
            subworks
        });
    },
    async delete(req, res) {
        //@ts-ignore
        const user_uid = req.uid;
        const { work_id } = req.params;
        //@ts-ignore
        await Works_1.default.destroy({
            where: {
                [sequelize_1.Op.and]: [
                    { id: work_id },
                    { user_uid }
                ]
            }
        })
            .then(() => res
            .status(200)
            .json({ log: 'success' }))
            .catch((err) => {
            (0, console_1.error)(err);
            return res
                .status(500)
                .json({ message: 'destroy work error' });
        });
    }
};
exports.default = worksController;
