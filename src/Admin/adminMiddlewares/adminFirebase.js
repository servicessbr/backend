
//const Works from'../models/Works')


const firebaseTmp = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const DIR = require('../../constants/DIR.json');
const UnlinkAsync = require('../../functions/UnlinkAsync');
//const fs = require('fs');
//var PATH = require('path');
/*
const serviceAccountTMP = require('../../keys/temp-3d85a-firebase-adminsdk-nyxj0-d9cc8b5ac5');
const adminTMP = firebaseTmp.initializeApp({
    credential: firebaseTmp.credential.cert(serviceAccountTMP),
}, 'tmp');

const storageRefTMP = adminTMP.storage().bucket(`gs://temp-3d85a.appspot.com`);

async function uploadFileTMP(path, destination) {
    const storageTMP = await storageRefTMP.upload(path, {
        public: true,
        destination,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storageTMP[0].metadata.mediaLink;

}

async function removeFileTMP(prefix) {
    storageRefTMP.deleteFiles({
        prefix
    }, function (err) {
        if (err) {
            return console.error(err);
        }
    });
}
*/

const adminFirebase = {
    verified: {
        async getCustomToken(req, res, next) {
            await adminTMP.auth()
                .createCustomToken('admin')
                .then(customToken => {
                    return res.status(200).json({ status: 'success', customToken: customToken });
                })
                .catch(error => {
                    console.error(`Error: ${error}`)
                    return res.status(500).json({ status: 'error' });
                });

        },
        /*async create(req:Request, res:Response, next:NextFunction) {

            const { uid } = req.body;

            if (!uid) return res.status(500).json({ log: 'firebase banners no user' });

            let list = [];
            
           
            for (let idx = 0; idx < req.files.length; idx++) {
                const filename = `${uid}[verify][${idx + 1}].webp`;
                const path = `${DIR}/${filename}`;

                let responseUrl = false;
                responseUrl = await uploadFileTMP(path, 'verified/' + uid + '/' + filename);
                if (responseUrl) await UnlinkAsync(path);
                
                list.push(
                    
                    'https://firebasestorage.googleapis.com' +
                    '/v0/b/temp-3d85a.appspot.com/o/'
                    + `${uid}%5Bverify%5D%5B${idx + 1}%5D.webp?alt=media`
                );

                
                if (idx === req.files.length - 1) {
                    
                    req.filenames = list;
                    return next();
                }
            }
        }*/
    },

    /*
    partner: {
        async crate(req, res) {
      
            const uid = req.uid;

            if (!uid) return res.status(500).json({ log: 'firebase partner no user' });
            const filename = `${uid}[partner].webp`;
            const path = `${DIR}/${filename}`;

            await uploadFileTMP(path, 'partner/' + filename)
                .then(async () => {
                    await UnlinkAsync(path);
                    return res.status(200).end()
                })
                .catch(async () => {
                    await UnlinkAsync(path);
                    return res.status(500).end()
                })
        },

        async delete(req, res, next) {
            const { uid } = req.body;

            await removeFileTMP('partner/' + uid + '[partner].webp')
                .then(async () => next())
                .catch(() => res.status(500).json({ log: 'Falha ao excluir a img partner' }))
        }
    }
        */


}

module.exports = adminFirebase;