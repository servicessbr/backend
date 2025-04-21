import Works from '../models/Works';

import firebaseAdmin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import DIR from '../configs/constants/DIR';
import UnlinkAsync from '../functions/UnlinkAsync';
import { Request, Response } from 'express';
/**
    * Public
*/
import serviceAccount from '../../public/keys/servicess-6e07b-firebase-adminsdk-fbsvc-f952374721.json';

import Users from '../models/Users';
const admin = firebaseAdmin.initializeApp({
    //@ts-ignore
    credential: firebaseAdmin.credential.cert(serviceAccount),
}, 'default');

const storageRef = admin.storage().bucket('gs://servicess-6e07b.firebasestorage.app');

async function uploadFile(path: any, destination: any) {
    const storage = await storageRef.upload(path, {
        public: true,
        destination,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storage[0].metadata.mediaLink;

}

async function removeFile(prefix: any) {
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
        async update(req: Request, res: Response) {

            //@ts-ignore
            const filename = req.filename;

            const path = `${DIR}/${filename}`;


            //@ts-ignore
            const uid = req.uid;

            //@ts-ignore
            const firePath = `${uid}/${req.filename}`

            if (!uid) {
                return res.status(500).json({ log: 'firebase no user' })
            } else {
                await uploadFile(path, firePath)
                    .then(async () => {
                        //@ts-ignore
                        await Users.update(
                            { avatar: true },
                            { where: { uid } }
                        )
                            .catch((err: Error) => {
                                console.error(err);
                            });
                    })
                    .catch(async err => {
                        console.error(err)

                    })

                await UnlinkAsync(path).catch((err: Error) => console.error(err));

                return res.status(200).json({ log: 'success' });
            }
        },

        async delete(req: Request, res: Response) {

            //@ts-ignore
            const uid = req.uid;

            await removeFile(`${uid}/${uid}.webp`)
                .then(() => res.status(200).end())
                .catch(() => res.status(500).json({ log: 'Falha ao excluir o avatar' }))
        }
    },

    async deleteAll(req: Request, res: Response) {

        //@ts-ignore
        const uid = req.uid;

        await removeFile(uid)
            .then(() => res.status(200).end())
            .catch(() => res.status(500).json({ log: 'Falha ao excluir todas as imagens' }))
    }

}

export default firebase;
