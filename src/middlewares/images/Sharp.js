 

const sharp = require('sharp');
const fs = require('fs');
const DIR = require('../../constants/DIR.json');


const sharpAvatar = async (req, res, next) => {

    /*@ts-ignore*/
    const uid = req.uid;

    /*@ts-ignore*/
    if (!req.file && !req.file.buffer) return res.status(500).json({ msg: 'Sem imagem' });
    if (!uid) return res.status(500).json({ msg: 'Sem usuário' });

    /*@ts-ignore*/
    const buffer = req.file.buffer;
    const filename = uid + '[p].webp';

    fs.access(DIR, (err) => err && fs.mkdirSync(DIR));

    try {
        await sharp(buffer)
            .resize({
                width: 200,
                height: 200
            })
            .toFormat("webp")
            .toFile(DIR + '/' + filename);

        /*@ts-ignore*/
        req.filename = filename;
        return next();

    } catch (error) {
        console.error(error);
        return res.status(200).json({ log: 'Falha ao otimizar a imagem' })
    }
}

const sharpBanners = async (req, res, next) => {
    /*@ts-ignore*/
    const uid = req.uid;
    const { work_id } = req.body;

    if (!req.files) return res.status(500).json({ msg: 'Sem imagens' });
    if (!uid || !work_id) return res.status(500).json({ msg: 'Sem usuário' });

    fs.access(DIR, (err) => err && fs.mkdirSync(DIR));

    /*@ts-ignore*/
    req.files.map(async (file, idx) => {
        const buffer = file.buffer;
        const filename = `${uid}[${work_id}]${idx ? `[${idx}]` : ''}.webp`;

        try {
            await sharp(buffer)
                .resize({
                    height: 420
                })
                .toFormat("webp")
                .toFile(DIR + '/' + filename);

            /* 
                Importante! - Sem essa condição o programa chama 
                o next() e executa o uploadFile do Firebase
                antes de fazer o sharp de todas as imagens:
            */
            /*@ts-ignore*/
            return (idx === (req.files.length - 1)) && next();
        } catch (error) {
            console.error(error);
            return res.status(200).json({ log: 'Falha ao otimizar a imagem' })
        }
    })
}

const sharpVerify = async (req, res, next) => {

    const { uid } = req.body;

    if (!req.files) return res.status(500).json({ msg: 'Sem imagens' });
    if (!uid) return res.status(500).json({ msg: 'Sem usuário' });

    fs.access(DIR, (err) => err && fs.mkdirSync(DIR));

    /*@ts-ignore*/
    req.files.map(async (file, idx) => {
        const buffer = file.buffer;
        const filename = `${uid}[verify][${idx + 1}].webp`;

        try {
            await sharp(buffer)
                .toFormat("webp")
                .toFile(DIR + '/' + filename);

            /* 
                Importante! - Sem essa condição o programa chama 
                o next() e executa o uploadFile do Firebase
                antes de fazer o sharp de todas as imagens:
            */
            /*@ts-ignore*/
            return (idx === (req.files.length - 1)) && next();
        } catch (error) {
            console.error(error);
            return res.status(200).json({ log: 'Falha ao otimizar a imagem' })
        }
    })
}

const sharpPartner = async (req, res, next) => {

    /*@ts-ignore*/
    const uid = req.uid;

    /*@ts-ignore*/
    if (!req.file && !req.file.buffer) return res.status(500).json({ msg: 'Sem imagem' });
    if (!uid) return res.status(500).json({ msg: 'Sem usuário' });

    /*@ts-ignore*/
    const buffer = req.file.buffer;
    const filename = `${uid}[partner].webp`;

    fs.access(DIR, (err) => err && fs.mkdirSync(DIR));

    try {
        await sharp(buffer)
            .toFormat("webp")
            .toFile(DIR + '/' + filename);

        /*@ts-ignore*/
        req.filename = filename;
        return next();

    } catch (error) {
        console.error(error);
        return res.status(200).json({ log: 'Falha ao otimizar a imagem' })
    }
}

module.exports = {sharpAvatar, sharpBanners, sharpVerify, sharpPartner}