"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const uuid_1 = require("uuid");
const DIR_1 = __importDefault(require("../configs/constants/DIR"));
const UnlinkAsync_1 = __importDefault(require("../functions/UnlinkAsync"));
/**
    * Public
*/
const servicess_6e07b_firebase_adminsdk_fbsvc_f952374721_json_1 = __importDefault(require("../../public/keys/servicess-6e07b-firebase-adminsdk-fbsvc-f952374721.json"));
const Users_1 = __importDefault(require("../models/Users"));
const admin = firebase_admin_1.default.initializeApp({
    //@ts-ignore
    credential: firebase_admin_1.default.credential.cert(servicess_6e07b_firebase_adminsdk_fbsvc_f952374721_json_1.default),
}, 'default');
const storageRef = admin.storage().bucket('gs://servicess-6e07b.firebasestorage.app');
async function uploadFile(path, destination) {
    const storage = await storageRef.upload(path, {
        public: true,
        destination,
        metadata: {
            firebaseStorageDownloadTokens: (0, uuid_1.v4)(),
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
            //@ts-ignore
            const filename = req.filename;
            const path = `${DIR_1.default}/${filename}`;
            //@ts-ignore
            const uid = req.uid;
            //@ts-ignore
            const firePath = `${uid}/${req.filename}`;
            if (!uid) {
                return res.status(500).json({ log: 'firebase no user' });
            }
            else {
                await uploadFile(path, firePath)
                    .then(async () => {
                    //@ts-ignore
                    await Users_1.default.update({ avatar: true }, { where: { uid } })
                        .catch((err) => {
                        console.error(err);
                    });
                })
                    .catch(async (err) => {
                    console.error(err);
                });
                await (0, UnlinkAsync_1.default)(path).catch((err) => console.error(err));
                return res.status(200).json({ log: 'success' });
            }
        },
        async delete(req, res) {
            //@ts-ignore
            const uid = req.uid;
            await removeFile(`${uid}/${uid}.webp`)
                .then(() => res.status(200).end())
                .catch(() => res.status(500).json({ log: 'Falha ao excluir o avatar' }));
        }
    },
    async deleteAll(req, res) {
        //@ts-ignore
        const uid = req.uid;
        await removeFile(uid)
            .then(() => res.status(200).end())
            .catch(() => res.status(500).json({ log: 'Falha ao excluir todas as imagens' }));
    }
};
exports.default = firebase;
