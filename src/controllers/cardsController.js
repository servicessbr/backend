const { QueryTypes } = require('sequelize');
const { error } = require('console')

// Models:
const Works = require('../models/Works');

const cardsController = {
    async list(req, res) {
        const { search, location, offset } = req.query;
        /*
            * Evita que um usuário apareça mais de uma vez na mesma pesquisa.
            * Faz o replace porque não tava dando para colocar o array dentro 
            * dos parênteses do IN.
            * Evita também um possível erro, pois o excluded da requisição,
            * obrigatoriamente, tem que ser um array com no mínimo uma string.
        */
        const excluded = (
            req.body.excluded &&
            Array.isArray(req.body.excluded) &&
            typeof req.body.excluded[0] === 'string'
        )
            ? req.body.excluded
            : [''];

        if (search === undefined) {
            return res.status(400).json({ message: 'empty query' })
        };

        /*
            * Pesquisa cada palavra individualmente.
        */
        function searchQuery() {
            let initial = search && search.split(' ')
            let words = []
            let searchQ = ''
            if (initial) {
                initial.map((it) => words.push(it))
                words = words
                    .filter((word) => word !== 'de')
                    .map((word) => `'%${word}%'`)
                    .join(', ');
                searchQ = ` AND (works.title ILIKE ANY(ARRAY[${words}]) 
                OR users.profession ILIKE ANY(ARRAY[${words}])) `
            }
            return searchQ;
        };

        /*
            * Se o city_id for undefined precisa trocar o sinal de = para != 0.
        */
        function locationQuery() {
            let locationQ = 'WHERE (city_id != 0)'
            if (!isNaN(parseInt(location)))
                locationQ = `WHERE (city_id = ${location})`
            return locationQ;
        };


        await Works.sequelize.query(
            `
            SELECT * 
            FROM (
            SELECT DISTINCT ON (works.user_uid)
            works.id,
            works.title,
            works.discount,
            works.banner,
            works.price,
            works.description,
            works.user_uid,
            cities.name AS city,
            users.uid,
            users.name,
            users.profession
            FROM works
            INNER JOIN users ON works.user_uid = users.uid
            INNER JOIN cities ON works.city_id = cities.id
            ${locationQuery()}
            ${searchQuery()}
            AND (users.uid NOT IN(:excluded))
            ORDER BY works.user_uid
            ) t
            ORDER BY price NULLS LAST
            LIMIT 21
            OFFSET ${offset || 1} * 21; 
            `,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    excluded: excluded
                }
            }
        )
            .then(list => {
                /*
                     * Retorna a lista normal
                     * e uma lista ( excluded ) com apenas os UIDs
                     * para evita que um usuário apareça mais de uma
                     * vez na mesma pesquisa.
                */
                const push = list.map(it => it.uid);
                return res.status(200).json({
                    list,
                    excluded: excluded.concat(push)
                })
            })
            .catch(err => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'list cards error' })
            });

    },

    async belongs(req, res) {
        const uid = req.uid;

        if (!uid)
            return res
                .status(400)
                .json({ message: 'empty uid query' });

        await Works.sequelize.query(
            `
            SELECT 
            works.user_uid,
            works.id,
            works.title,
            works.discount,
            works.banner,
            works.price,
            works.description,
            works.user_uid,
            cities.name AS city,
            users.uid,
            users.name,
            users.profession
            FROM works
            INNER JOIN users ON works.user_uid = users.uid
            INNER JOIN cities ON works.city_id = cities.id
            WHERE works.user_uid = :uid;
            `,
            {
                type: QueryTypes.SELECT,
                replacements: { uid }
            }
        )
            .then(data => res.status(200).json(data).end())
            .catch(err => {
                error(err);
                return res.status(500).json({ message: 'my cards error' }).end();
            });
    },
};

module.exports = cardsController;