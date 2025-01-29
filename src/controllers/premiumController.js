
const Premiums = require("../models/Premiums");
//import Sequelize from 'sequelize';

const premiumController = {
    async free(req, res) {
        const { uid } = req.params;

        // update
        /*@ts-ignore*/
        return Premiums.create({
            user_uid: uid.toString().trim(),
            expiration: null,
            credit: 2
        })
            .then((r) => {
                return res.status(200).end();
            })
            .catch((err) => {
                console.error('Premium free error', err)
                return res.status(401).json({ message: 'Usúario já criou uma conta Premium' });
            });

    },

    async isActive(req, res) {
        const { uid } = req.params;

        const plan = ['free', 'test', 'full', 'expired'];

        /*@ts-ignore*/
        return Premiums.findOne({
            where: { user_uid: uid },
            attributes: ['expiration', 'credit']
        })
            .then((r) => {
                // É Premium, esta com a data em dia:
                /*@ts-ignore*/
                if (r && r.expiration && r.expiration > new Date()) {
                    return res.status(200).json({
                        plan: plan[2],
                        /*@ts-ignore*/
                        expiration: r.expiration
                    })
                }
                // Já foi Premium mas a data expirou:
                /*@ts-ignore*/
                else if (r && r.expiration && r.expiration < new Date()) {
                    return res.status(200).json({ plan: plan[3] })
                }
                // Esta no periodo de teste, tem saldo:
                /*@ts-ignore*/
                else if (r && !r.expiration && r.credit && r.credit > 0) {
                    /*@ts-ignore*/
                    return res.status(200).json({ plan: plan[1], credit: r.credit })
                }
                // Não atende nenhum requisito para ser Premium:
                else return res.status(200).json({ plan: plan[0] })

            })
            .catch((err) => {
                console.error('Premium free error', err)
                return res.status(401).json({ message: 'Usúario não é Premium' });
            });
    }
}

module.exports = premiumController;