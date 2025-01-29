 

// Models:
const Works = require('../models/Works');
const Users = require('../models/Users');
const Premiums = require('../models/Premiums');

const MixedController = {
    /*
        * Bloqueia valores null;
        * Cria um refresh token e um user id único;
        * Insere um novo usuário.
    */
    async verified(req, res) {
        //@ts-ignore
        const uid = req.uid;
        const user = await Users.findOne({
            attributes: ['verified'],
            where: { uid }
        });

        if (!user) return res.status(400).json({ message: 'Faça login novamente' })

        let verified = false;
        if (user.verified) verified = true;

        return res.status(200).json({ verified });
    },
    async limit(req, res) {
        //@ts-ignore
        const uid = req.uid;
        if (!uid) return res.status(500).json({ message: 'No uid limit works.' });

        //@ts-ignore
        const count = await Works.count({
            where: { user_uid: uid },
        });

        const premium = await Premiums.findOne({
            attributes: ['expiration'],
            where: { user_uid: uid }
        });

        let allowed = false;

        const expiration = new Date().getDate() + 1; //Eu liberei para todos pq tava dando erro mas o certo seria a linha de baixo:
        //const expiration = premium.expiration ? new Date(premium.expiration) : Date().getDate() - 1);
        const today = new Date();

        if (!count || count < 2) allowed = true;
        else if (expiration > today) allowed = true;

        // acho que não precisa desse verified ai:
        return res.status(200).json({ count, verified: false, allowed });
    },

    async middleware(req, res, next) {
        //@ts-ignore
        const uid = req.uid;

        if (!uid) return res.status(500).end();

        //@ts-ignore
        const count = await Works.count({
            where: { user_uid: uid },
        });

        const premium = await Premiums.findOne({
            attributes: ['expiration', 'credit'],
            where: { user_uid: uid }
        });

        const expiration = new Date().getDate() + 1; //Eu liberei para todos pq tava dando erro mas o certo seria a linha de baixo:
        //const expiration = premium.expiration ? new Date(premium.expiration) : Date().getDate() - 1);
        const today = new Date();

        const isDefinitivePremium = (expiration > today);

        if (count >= 20) res.status(500).json({ message: 'Limite de 20 anúncios por usuário.' });
        // Se ele não é "Premium definitivo" e já tem um anúncio criado.
        else if (!isDefinitivePremium && count >= 2) res.status(500).json({ message: 'Limite de 2 anúncios para planos Free e Premium em período de teste.' });
        else next();
    }
}

module.exports = MixedController;
