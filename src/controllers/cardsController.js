const { QueryTypes } = require('sequelize');
const { error } = require('console')

// Models:
const Works = require('../models/Works');

const cardsController = {
    async list(req, res) {
        const { search, location, offset } = req.query
        const { excluded } = req.body

        if (search === undefined) {
            return res.status(400).json({ message: 'empty query' })
        }

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
            return searchQ
        }

        /*
            * Se o city_id for undefined precisa trocar o sinal de = para != 0.
        */
        function locationQuery() {
            let locationQ = 'WHERE (city_id != 0)'
            if (!isNaN(parseInt(location)))
                locationQ = `WHERE (city_id = ${location})`
            return locationQ
        }

        /*
            * Evita que um usuário apareça mais de uma vez na mesma pesquisa.
            * Faz o replace porque não tava dando para colocar o array dentro 
            * dos parênteses do IN.
        */
        function excludedQuery() {
            let excludedQ = ''
            if (Array.isArray(excluded) && excluded.length)
                excludedQ = `AND (users.uid NOT IN${JSON.stringify(excluded)})`
                    .replace(/\[/g, "(")
                    .replace(/\]/g, ")")
                    .replace(/"/g, "'")
            return excludedQ
        }

        await Works.sequelize.query(
            `SELECT DISTINCT ON (users.uid) works.id, works.title, works.discount, 
            works.banner, works.price, works.description, 
            cities.name as city, users.uid, users.name,
            users.profession, users.avatar
            FROM works
            INNER JOIN users
            ON (works.user_uid = users.uid)
            INNER JOIN cities
            ON (works.city_id = cities.id)
            ${locationQuery()}
            ${searchQuery()}
            ${excludedQuery()}
            LIMIT 21
            OFFSET ${offset || 1} * 21;`,
            {
                type: QueryTypes.SELECT
            }
        )
            .then(list => 
                /*
                     * Retorna a lista normal
                     * e uma lista ( excluded ) com apenas os UIDs
                     * para evita que um usuário apareça mais de uma
                     * vez na mesma pesquisa.
                */
                res.status(200).json({
                    list,
                    excluded: list
                        .map(it => it.ui)
                })
            )
            .catch(err => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'list cards error' })
            })

    },

    async belongs(req, res) {
        const { uid } = req.params;

        const { wid } = req.query;

        if (uid === undefined) {
            return res.status(400).json({ message: 'empty uid query' })
        };

        var except = ';';
        if (wid) { except = ` AND (works.id != ${wid});` }

        if (!Works.sequelize) return error('!Works.sequelize');

        await Works.sequelize.query(
            " SELECT "
            + " works.id, works.title, works.suspended, "
            + " works.price, works.description, cities.name as city, "
            + " users.uid, users.name, users.profession "
            + " FROM works "
            + " INNER JOIN users "
            + " ON (works.user_uid = users.uid) "
            + " INNER JOIN cities "
            + " ON (works.city_id = cities.id) "
            + " WHERE (works.user_uid = :uid)"
            + except,
            {
                replacements: { uid },
                type: QueryTypes.SELECT
            }
        )
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                error(err);
                return res.status(500).json({ message: 'my cards error' });
            });
    },
};

module.exports = cardsController;