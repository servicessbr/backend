//const { Op } = require('sequelize');

const Works = require('../models/Works');

const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const DIR = require('../constants/DIR.json');
const UnlinkAsync = require('../functions/UnlinkAsync');
const fs = require('fs');
//const PATH from 'path';

// TMP:
//const serviceAccount = require('../keys/temp-3d85a-firebase-adminsdk-nyxj0-d9cc8b5ac5');
// DEFAULT:
const serviceAccount = require('../keys/servicess-pictures-firebase-adminsdk-gqhv7-7171226400');

const Users = require('../models/Users');
const admin = firebaseAdmin.initializeApp({
    /*@ts-ignore*/
    credential: firebaseAdmin.credential.cert(serviceAccount),
}, 'default');

// TMP:
//const storageRef = admin.storage().bucket(`gs://temp-3d85a.appspot.com`);
// DEFAULT:
const storageRef = admin.storage().bucket(`gs://servicess-7a7de.appspot.com`);

async function uploadFile(path, destination) {
    const storage = await storageRef.upload(path, {
        public: true,
        destination,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storage[0].metadata.mediaLink;

}

async function removeFile(prefix) {
    storageRef.deleteFiles({
        prefix
    }, function (err) {
        if (err) {
            return console.error(err);
        }
    });
}
/*
async function getFile(prefix) {
    //let blob = null;
    storageRef.file(prefix).getSignedUrl({
        action: "read",
        expires: '03-17-2025' // this is an arbitrary date
    })
        .then(data => {
            const url = data[0];
            const blob = new Blob([url])
            console.lo(blob)
        })
    //return blob;
}
*/

const firebase = {
    banners: {
        async update(req, res) {
            /*@ts-ignore*/
            const uid = req.uid;
            const { work_id } = req.body;

            if (!uid || !work_id) return res.status(500).json({ log: 'firebase banners no user' });

            /*@ts-ignore*/
            req.files.map(async (file, idx) => {
                const filename = `${uid}[${work_id}]${idx ? `[${idx}]` : ''}.webp`;
                const path = `${DIR}/${filename}`;
                if (fs.existsSync(path)) {
                    let responseUrl = false;
                    responseUrl = await uploadFile(path, filename);
                    responseUrl && await UnlinkAsync(path).catch(err => console.error(err));
                } else console.error("File don't exist");

            })

            /*@ts-ignore*/
            for (let idx = req.files.length; idx < 6; idx++) {
                const name = `${uid && uid}${work_id ? `[${work_id}]${idx !== 0 ? `[${idx}]` : ''}` : ''}.webp`;
                removeFile(name);
            }

            /*@ts-ignore*/
            await Works.update(
                /*@ts-ignore*/
                { banner: req.files.length },
                { where: { id: work_id } }
            )
                .catch((err) => {
                    console.error(err);
                });

            return res.status(200).json({ log: 'success' });
        },

        async deleteWork(req, res) {
            const { work_id } = req.body;
            /*@ts-ignore*/
            const uid = req.uid;

            // Verifica se quem esta fazendo a requisição é de fato o dono do serviço
            const result = work_id
                /*@ts-ignore*/
                ? await Works.findOne({
                    attributes: ['user_uid'],
                    where: { id: work_id }
                }) : false;

            /*@ts-ignore*/
            if (work_id && (result === null || result.user_uid !== uid)) return res.status(500).json({ log: 'Firebase owener not match' });

            if (!uid) return res.status(500).json({ log: 'firebase no user' });

            if (!work_id) return res.status(500).json({ log: 'firebase no work' });

            for (let idx = 0; idx < 6; idx++) {
                const name = `${uid && uid}${work_id ? `[${work_id}]${idx !== 0 ? `[${idx}]` : ''}` : ''}.webp`;
                removeFile(name);
            }

            return res.status(200).json({ log: 'success' });
        }
    },

    avatar: {
        async update(req, res) {

            /*@ts-ignore*/
            const filename = req.filename;

            const path = `${DIR}/${filename}`;

            /*@ts-ignore*/
            const uid = req.uid;

            if (!uid) {
                return res.status(500).json({ log: 'firebase no user' })
            } else {
                await uploadFile(path, filename)
                    .then(async () => {
                        await Users.update(
                            { avatar: true },
                            { where: { uid } }
                        )
                            .catch((err) => {
                                console.error(err);
                            });
                    })
                    .catch(async err => {
                        console.error(err)

                    })

                await UnlinkAsync(path).catch(err => console.error(err));

                return res.status(200).json({ log: 'success' });
            }
        },

        async delete(req, res) {
            /*@ts-ignore*/
            const uid = req.uid;

            await removeFile(uid + '[p].webp')
                .then(async () => {
                    await Users.update(
                        { avatar: false },
                        { where: { uid } }
                    )
                        .catch((err) => { console.error(err) });
                    return res.status(200).end()
                })
                .catch(() => res.status(500).json({ log: 'Falha ao excluir o avatar' }))
        }
    },

    async deleteAll(req, res) {
        /*@ts-ignore*/
        const uid = req.uid;

        await removeFile(uid)
            .then(() => res.status(200).end())
            .catch(() => res.status(500).json({ log: 'Falha ao excluir todas as imagens' }))
    }

}

module.exports = firebase;
