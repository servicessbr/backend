//const { Op } = require('sequelize');

const Works = require('../models/Works');

const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const DIR = require('../../public/constants/DIR.json');
const UnlinkAsync = require('../functions/UnlinkAsync');
const fs = require('fs');
//const PATH from 'path';

// TMP:
//const serviceAccount = require('../keys/temp-3d85a-firebase-adminsdk-nyxj0-d9cc8b5ac5');
// DEFAULT:
const serviceAccount = require('../../public/keys/servicess-6e07b-firebase-adminsdk-fbsvc-f952374721');

const Users = require('../models/Users');
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
}, 'default');

const storageRef = admin.storage().bucket('gs://servicess-6e07b.firebasestorage.app');

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
    avatar: {
        async update(req, res) {

             
            const filename = req.filename;

            const path = `${DIR}/${filename}`;

             
            const uid = req.uid;

            const firePath = `${uid}/${req.filename}`

            if (!uid) {
                return res.status(500).json({ log: 'firebase no user' })
            } else {
                await uploadFile(path, firePath)
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

            const uid = req.uid;

            await removeFile(`${uid}/${uid}.webp`)
                .then(() => res.status(200).end())
                .catch(() => res.status(500).json({ log: 'Falha ao excluir o avatar' }))
        }
    },

    async deleteAll(req, res) {

        const uid = req.uid;

        await removeFile(uid)
            .then(() => res.status(200).end())
            .catch(() => res.status(500).json({ log: 'Falha ao excluir todas as imagens' }))
    }

}

module.exports = firebase;
