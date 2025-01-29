
const { Op, QueryTypes } = require('sequelize');
//const ErrorTransporter = require('../config/email/ErrorTransporter');

// Models:
const Works = require('../models/Works');

const worksController = {
    async create(req, res) {
        /*@ts-ignore*/
        const user_uid = req.uid;

        const {
            title, tags,
            remote, showwmail, showphone,
            price, discount,
            description, details, availability, hours, socialmidias,
            city_id, district, address, number, socialmedia, checklist, per /* zipcode,*/
        } = req.body;

        if (city_id === null) {

            //ErrorTransporter('WCTRLx0001', 'no-log', { user_uid, city_id }, req.originalUrl); // ----

            return res.status(500).json({ message: 'empty city' });
        };
        if (title === null) {

            //ErrorTransporter('WCTRLx0002', 'no-log', { user_uid, tittle }, req.originalUrl); // ----

            return res.status(500).json({ message: 'empty title' })
        };

        /*@ts-ignore*/
        await Works.create({
            user_uid,
            title, tags,
            remote, showwmail, showphone,
            description, details, availability, hours, socialmidias,
            city_id, district, address,
            price: /^\d+$/.test(price) ? parseInt(price) : null,
            discount: /^\d+$/.test(discount) ? parseInt(discount) : null,
            number: /^\d+$/.test(number) ? parseInt(number) : null,
            socialmedia, checklist, per
            /* zipcode, standby: true, */

        })
            /*@ts-ignore*/
            .then(work => res.status(200).json({ work_id: work.id }))
            .catch((e) => {

                //ErrorTransporter('WCTRLx0003', e, { body: req.body }, req.originalUrl); // ----

                console.error(e);
                return res.status(500).json({ message: 'create work error' });
            });

    },

    async update(req, res) {

        /*@ts-ignore*/
        const user_uid = req.uid;

        const {
            work_id,
            title, tags,
            remote, showwmail, showphone,
            price, discount,
            description, details, availability, hours, socialmidias,
            city_id, district, address, number, socialmedia, checklist, per, /* zipcode,*/
        } = req.body;

        if (city_id === null) {

            //ErrorTransporter('WCTRLx0004', 'no-log', { user_uid, city_id }, req.originalUrl); // ----

            return res.status(500).json({ message: 'empty city' })
        };
        if (title === null) {

            //ErrorTransporter('WCTRLx0005', 'no-log', { user_uid, tittle }, req.originalUrl); // ----

            return res.status(500).json({ message: 'empty title' })
        };

        /*@ts-ignore*/
        await Works.update(
            {
                title, tags,
                remote, showwmail, showphone,
                price: /^\d+$/.test(price) ? parseInt(price) : null,
                discount: /^\d+$/.test(discount) ? parseInt(discount) : null,
                number: /^\d+$/.test(number) ? parseInt(number) : null,
                description, details, availability, hours, socialmidias,
                city_id, district, address, socialmedia, checklist, per
                /* zipcode, standby: true */
            },
            {
                where: {
                    [Op.and]: [{ id: work_id }, { user_uid }]
                }
            }
        )
            .then(() => res.status(200).json(work_id))
            .catch((e) => {

                //ErrorTransporter('WCTRLx0006', e, { body: req.body }, req.originalUrl); // ----

                console.error(e);
                return res.status(500).json({ message: 'work update error' })
            });
    },

    async delete(req, res) {
        /*@ts-ignore*/
        const user_uid = req.uid;
        const { work_id } = req.params;

        /*@ts-ignore*/
        await Works.destroy(
            {
                where: {
                    [Op.and]: [{ id: work_id }, { user_uid }]
                }
            }
        )
            .then(() => res.status(200).json({ log: 'success' }))
            .catch((e) => {

                //ErrorTransporter('WCTRLx0007', e, { user_uid }, req.originalUrl); // ----

                console.error(e);
                return res
                    .status(500)
                    .json({ message: 'destroy work error' })
            });
    },

    async load(req, res) {

        const { work_id } = req.params;

        /*@ts-ignore*/
        await Works.sequelize.query(
            ' SELECT '
            + ' works.*, '
            + ' users.name as user_name, users.verified, users.avatar, users.partner, premiums.expiration as premium, '
            + ' users.profession as user_profession, users.description as user_description, '
            + ' cities.name as city, states.name as state'
            + ' FROM works '
            + ' INNER JOIN users '
            + ' ON (works.user_uid = users.uid) '
            + ' LEFT JOIN premiums '
            + ' ON (works.user_uid = premiums.user_uid) '
            + ' INNER JOIN cities '
            + ' ON (works.city_id = cities.id) '
            + ' INNER JOIN states '
            + ' ON (cities.state_id = states.id) '
            + ' WHERE (works.id = :work_id) '
            + ' LIMIT 1; ',
            {
                replacements: { work_id },
                type: QueryTypes.SELECT
            }
        )
            .then((work) => res.status(200).json(work[0]))
            .catch((e) => {

                //ErrorTransporter('WCTRLx0008', e, { work_id }, req.originalUrl); // ----

                console.error(e);
                return res.status(500).json({ message: 'load work error' });
            });
    },

    async premium(req, res) {
        const { wid, months } = req.body;

        if (!wid) return res.status(500).json({ log: 'no wid' });
        if (!months || Number.isNaN(parseInt(months))) return res.status(500).json({ log: 'months isNaN' });

        const date = new Date();
        const expireDate = new Date(date.setMonth(date.getMonth() + parseInt(months)));

        /*@ts-ignore*/
        await Works.update(
            {
                premium: expireDate
            },
            {
                where: { id: wid }
            }
        )
            .then(() => res.status(200).end())
            .catch((e) => {
                console.error(e);
                return res.status(500).json({ message: 'premium update error' })
            });

    }
}

module.exports = worksController;
