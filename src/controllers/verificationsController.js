
const { encryptSensitiveData, hashDocument } = require('../helpers/cryptoSensitiveData');
//Models
const Verifications = require('../models/Verifications');
const Users = require('../models/Users');

const verificationsController = {
    async create(req, res) {
        //@ts-ignore
        const uid = req.uid;
        const {
            document,
            birth_date,
            full_address,
            full_name
            
        } = req.body;

        if (
            !document ||
            !full_name ||
            !birth_date ||
            !full_address
        ) return res.status(500).json({ message: 'missing verifications data' });

        const kic = process.env.KEY_IDENTITY_CARD;
        if (!kic) return res.status(500).json({ message: 'key not found' });

        await Verifications.create(
            {
                user_uid: uid,

                public_id: hashDocument(document),

                sensitive_data: encryptSensitiveData(
                    JSON.stringify({
                        document,
                        full_name,
                        birth_date,
                        full_address
                    }), kic
                )
            }
        )
            .then(async () => {
                await Users.update(
                    {
                        verified: true
                    },
                    { where: { uid } }
                )
                    .then(() => res.status(204).end())
                    .catch((err) => {
                        console.error(err);
                        return res.status(500).end();
                    });

            })
            .catch((err) => {
                console.error(err.name);
                if (
                    err.name &&
                    err.name === 'SequelizeUniqueConstraintError') {
                    return res.status(409).json({ message: 'Esse CPF já foi registrado.' })
                }
                else return res.status(500).end();
            })
    }
}

module.exports = verificationsController;