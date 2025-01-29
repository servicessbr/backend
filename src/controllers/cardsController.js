
const { QueryTypes } = require('sequelize');

// Models:
const Works = require('../models/Works');

const cardsController = {
    list: {
        async premium(req, res) {
            const { search, location, offset, limit, avatar } = req.query;

            if (search === undefined) {
                return res.status(400).json({ message: 'empty query' })
            };

            /*@ts-ignore*/
            let initial = search && search.split(' ');
            let words = [];
            let searchQuery = ''
            if (initial) {
                //words = keyWords(initial);
                initial.map((it) => words.push(it))
                words = words.filter((word) => word !== 'de').map((word) => `'%${word}%'`).join(', ');
                searchQuery = ` AND (works.title ILIKE ANY(ARRAY[${words}]) OR users.profession ILIKE ANY(ARRAY[${words}])) `
            }

            let locationQuery = 'WHERE (city_id != 0)';
            /*
            if (!isNaN(parseInt(state)))
                locationQuery = `WHERE (city_id::text LIKE '${state}%')`
            else 
            */

            /*@ts-ignore*/
            if (!isNaN(parseInt(location)))
                locationQuery = `WHERE (city_id = ${location})`;

            let requiredAvatar = '';
            if (avatar === 'true') {
                requiredAvatar = ' AND avatar = true ';
            }

            if (!Works.sequelize) return console.error('!Works.sequelize');

            await Works.sequelize.query(
                ' SELECT '
                + ' works.id, works.title, works.discount, works.banner, premiums.expiration as premium,'
                + ' works.price, works.description, cities.name as city, '
                + ' users.uid, users.name, users.verified,users.profession, users.avatar '
                + ' FROM works '
                + ' INNER JOIN users '
                + ' ON (works.user_uid = users.uid) '
                + ' LEFT JOIN premiums '
                + ' ON (works.user_uid = premiums.user_uid) '
                + ' INNER JOIN cities '
                + ' ON (works.city_id = cities.id) '
                + locationQuery
                + searchQuery
                + requiredAvatar
                + ' AND (premiums.expiration > now() OR (premiums.expiration IS NULL AND premiums.credit > 0)) '
                + ' AND standby != true '
                + ' AND suspended IS NOT TRUE AND copy IS NOT TRUE'
                + ` ORDER BY random() `
                + ` LIMIT ${limit ? limit : 21}`
                /*@ts-ignore*/
                + ` OFFSET ${offset === undefined ? 0 : (offset * 21)};`,
                {
                    type: QueryTypes.SELECT
                }
            )
                .then((data) => res.status(200).json(data))
                .catch((err) => {
                    console.error('2222222: ', err);
                    return res.status(500).json({ message: 'list cards error' });
                });
        },
        async composed(req, res) {
            const { search, location, offset, stop } = req.query;

            if (search === undefined) {
                return res.status(400).json({ message: 'empty query' })
            };

            /*@ts-ignore*/
            let initial = search && search.split(' ');
            let words = [];
            let searchQuery = ''
            if (initial) {
                //words = keyWords(initial);
                initial.map((it) => words.push(it))
                words = words.filter((word) => word !== 'de').map((word) => `'%${word}%'`).join(', ');
                searchQuery = ` AND (works.title ILIKE ANY(ARRAY[${words}]) OR users.profession ILIKE ANY(ARRAY[${words}])) `
            }

            let locationQuery = 'WHERE (city_id != 0)';
            /*
            if (!isNaN(parseInt(state)))
                locationQuery = `WHERE (city_id::text LIKE '${state}%')`
            else 
            */
            /*@ts-ignore*/
            if (!isNaN(parseInt(location)))
                locationQuery = `WHERE (city_id = ${location})`;

            if (!Works.sequelize) return console.error('!Works.sequelize');

            const works = await Works.sequelize.query(
                ' SELECT '
                + ' works.id, works.title, works.discount, works.banner, premiums.expiration as premium,'
                + ' works.price, works.description, cities.name as city, '
                + ' users.uid, users.name, users.verified,users.profession, users.avatar '
                + ' FROM works '
                + ' INNER JOIN users '
                + ' ON (works.user_uid = users.uid) '
                + ' LEFT JOIN premiums '
                + ' ON (works.user_uid = premiums.user_uid) '
                + ' INNER JOIN cities '
                + ' ON (works.city_id = cities.id) '
                + locationQuery
                + searchQuery
                + ' AND users.avatar is true '
                + ' AND ( '
                + ' premiums.id IS NULL OR '
                + ' ( premiums.id IS NOT NULL AND premiums.expiration < now() ) OR '
                + ' ( premiums.id IS NOT NULL AND premiums.credit < 1 ) '
                + ' ) '
                + ' AND standby != true '
                + ' AND suspended IS NOT TRUE AND copy IS NOT TRUE'
                + ` ORDER BY works.updated_at DESC `
                + ` LIMIT 21`
                /*@ts-ignore*/
                + ` OFFSET ${offset === undefined ? 0 : (offset * 21)};`,
                {
                    type: QueryTypes.SELECT
                }
            )

            const empty =
                stop !== 'true'
                    ? await Works.sequelize.query(
                        ' SELECT '
                        + ' works.id, works.title, works.discount, works.banner, premiums.expiration as premium,'
                        + ' works.price, works.description, cities.name as city, '
                        + ' users.uid, users.name, users.verified,users.profession, users.avatar '
                        + ' FROM works '
                        + ' INNER JOIN users '
                        + ' ON (works.user_uid = users.uid) '
                        + ' LEFT JOIN premiums '
                        + ' ON (works.user_uid = premiums.user_uid) '
                        + ' INNER JOIN cities '
                        + ' ON (works.city_id = cities.id) '
                        + locationQuery
                        + searchQuery
                        + ' AND users.avatar is not true '
                        + ' AND (premiums.expiration < now() OR premiums.expiration is null) '
                        + ' AND standby != true '
                        + ' AND suspended IS NOT TRUE AND copy IS NOT TRUE'
                        + ` ORDER BY works.updated_at DESC `
                        + ` LIMIT 8`
                        /*@ts-ignore*/
                        + ` OFFSET ${offset === undefined ? 0 : (offset * 8)};`,
                        {
                            type: QueryTypes.SELECT
                        }
                    )
                    : [];

            return res.status(200).json({
                works, empty
            });
        },
        async seeMore(req, res) {
            const { search, location } = req.query;

            if (search === undefined) {
                return res.status(400).json({ message: 'empty query' })
            };

            /*@ts-ignore*/
            let initial = search && search.split(' ');
            let words = [];
            let searchQuery = ''
            if (initial) {
                //words = keyWords(initial);
                initial.map((it) => words.push(it))
                words = words.filter((word) => word !== 'de').map((word) => `'%${word}%'`).join(', ');
                searchQuery = ` AND (works.title ILIKE ANY(ARRAY[${words}]) OR users.profession ILIKE ANY(ARRAY[${words}])) `
            }

            let locationQuery = 'WHERE (city_id != 0)';
            /*
            if (!isNaN(parseInt(state)))
                locationQuery = `WHERE (city_id::text LIKE '${state}%')`
            else 
            */
            /*@ts-ignore*/
            if (!isNaN(parseInt(location)))
                locationQuery = `WHERE (city_id = ${location})`;

            let requiredAvatar = ' AND avatar = true ';

            if (!Works.sequelize) return console.error('!Works.sequelize');

            await Works.sequelize.query(
                ' SELECT '
                + ' works.id, works.title, works.discount, works.banner, premiums.expiration as premium,'
                + ' works.price, works.description, cities.name as city, '
                + ' users.uid, users.name, users.verified,users.profession, users.avatar '
                + ' FROM works '
                + ' INNER JOIN users '
                + ' ON (works.user_uid = users.uid) '
                + ' LEFT JOIN premiums '
                + ' ON (works.user_uid = premiums.user_uid) '
                + ' INNER JOIN cities '
                + ' ON (works.city_id = cities.id) '
                + locationQuery
                + searchQuery
                + requiredAvatar
                + ' AND standby != true '
                + ' AND suspended IS NOT TRUE AND copy IS NOT TRUE'
                + ` ORDER BY works.popularity DESC, works.banner DESC, random() `
                + ` LIMIT 10`
                + ` OFFSET 0;`,
                {
                    type: QueryTypes.SELECT
                }
            )
                .then((data) => res.status(200).json(data))
                .catch((err) => {
                    console.error('3333333333: ', err);
                    return res.status(500).json({ message: 'list cards error' });
                });
        },
    },

    async belongs(req, res) {
        /*@ts-ignore*/
        const { uid } = req.params;
        /*@ts-ignore*/
        const { wid } = req.query;

        if (uid === undefined) {

            //ErrorTransporter('CCTRLx0003', 'no-log', { uid, wid }, req.originalUrl); // ----

            return res.status(400).json({ message: 'empty uid query' })
        };

        var except = ';';
        if (wid) { except = ` AND (works.id != ${wid});` }

        if (!Works.sequelize) return console.error('!Works.sequelize');

        await Works.sequelize.query(
            " SELECT "
            + " works.id, works.title, works.suspended, premiums.expiration as premium, "
            + " works.price, works.description, cities.name as city, "
            + " users.uid, users.name, users.profession "
            + " FROM works "
            + " INNER JOIN users "
            + " ON (works.user_uid = users.uid) "
            + " LEFT JOIN premiums "
            + " ON (works.user_uid = premiums.user_uid) "
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
            .catch((e) => {

                //ErrorTransporter('CCTRLx0004', e, { uid, wid }, req.originalUrl); // ----

                console.error(e);
                return res.status(500).json({ message: 'my cards error' });
            });
    },
};

module.exports = cardsController;