
const { Op, QueryTypes } = require('sequelize');
const { error } = require('console');

/* 
    * Models:
*/
const Works = require('../models/Works');
const Subworks = require('../models/Subworks');
const stringContainsOnlyDigits = require('../functions/onlyDigits/stringContainsOnlyDigits');

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
        })
    else return [];
}

const worksController = {
    async create(req, res) {
        const uid = req.uid;
        const pro = req.pro;

        if (!pro)
            return res
                .status(403)
                .json({ message: 'work create - user is not PRO' })
                .end();

        const {
            title, description,
            price, city_id,

            subworks
        } = req.body;

        if (!city_id) return res
            .status(500)
            .json({ message: 'empty city' });

        if (!title) return res
            .status(500)
            .json({ message: 'empty title' });

        if (
            !price ||
            !(stringContainsOnlyDigits(price))
        ) return res
            .status(500)
            .json({ message: 'empty title' });

        await Works.create({
            user_uid: uid,
            title, description, city_id,
            price: parseInt(price),
        })
            .then(async work => {
                if (!Array.isArray(subworks)) return

                const insertSubWorks = insertableSubworks(subworks, work.id);

                await Subworks.bulkCreate(insertSubWorks)
                    .then(() => res
                        .status(200)
                        .json({ work_id: work.id }))
                    .catch(err => {
                        error(err);
                        return res
                            .status(500)
                            .json({ message: 'create subwork error' })
                    })
            })
            .catch(err => {
                error(err);
                return res
                    .status(500)
                    .json({ message: 'create work error' })
            });
    },

    async update(req, res) {
        /*
            * Confere se tem algum dado para ser alterado
            * ou ta vazia.
        */
        if (!Object.keys(req.body).length)
            return res
                .status(204)
                .end()

        const { work_id } = req.body;

        const { work, subworks } = req.body;

        (work && Object.keys(work).length) &&
            await Works.update(
                work,
                {
                    status: ['title', 'description', 'price'],
                    where: { id: work_id }
                }
            )
                .catch(err => error(err));

        (subworks && Array.isArray(subworks)) &&
            Subworks.destroy({
                where: { work_id }
            })
                .then(async () => {
                    const insertSubWorks = insertableSubworks(subworks, work_id);
                    await Subworks.bulkCreate(insertSubWorks)
                        .catch(err => error(err));
                })
                .catch(err => error(err));

        return res.status(200).end();
    },

    async load(req, res) {
        const { work_id } = req.params;

        if (!(stringContainsOnlyDigits(work_id)))
            return res
                .status(500)
                .json({ message: 'error - work_id is not a number' })

        const works = await Works.sequelize.query(
            `SELECT 
            works.id, works.title, works.description, 
            works.price, works.city_id, works.user_uid,
            users.name as user_name, users.profession as user_profession, 
            users.description as user_description, 
            cities.name as city, states.name as state
            FROM works 
            INNER JOIN users 
            ON (works.user_uid = users.uid) 
            INNER JOIN cities 
            ON (works.city_id = cities.id) 
            INNER JOIN states 
            ON (cities.state_id = states.id) 
            WHERE (works.id = :work_id) 
            LIMIT 1;`,
            {
                replacements: { work_id },
                type: QueryTypes.SELECT
            }
        ).catch(err => error(err))

        if (!works)
            return res
                .status(200)
                .json({ message: 'load works error' })

        const subworks = await Subworks.findAll({
            attributes: ['id', 'title', 'description', 'price'],
            where: { work_id }
        }).catch(err => error(err))

        if (!Array.isArray(subworks))
            return res
                .status(200)
                .json({ message: 'load subworks error' })

        return res
            .status(200)
            .json({
                work: works[0],
                subworks
            })
    },

    async delete(req, res) {
        const user_uid = req.uid;
        const { work_id } = req.params;

        await Works.destroy(
            {
                where: {
                    [Op.and]: [
                        { id: work_id },
                        { user_uid }
                    ]
                }
            }
        )
            .then(() => res
                .status(200)
                .json({ log: 'success' })
            )
            .catch((err) => {
                error(err);
                return res
                    .status(500)
                    .json({ message: 'destroy work error' })
            });
    }
}

module.exports = worksController;
