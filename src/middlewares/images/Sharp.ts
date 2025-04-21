/*
    * Public
*/


import sharp from 'sharp';
import fs from 'fs';

import { Request, Response, NextFunction } from 'express';
import DIR from '../../configs/constants/DIR';


export const sharpAvatar = async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const uid = req.uid;


    if (!(req.file && req.file.buffer)) return res.status(500).json({ msg: 'Sem imagem' });
    if (!uid) return res.status(500).json({ msg: 'Sem usuário' });


    const buffer = req.file.buffer;
    const filename = uid + '.webp';

    fs.access(DIR, (err) => err && fs.mkdirSync(DIR));

    try {
        await sharp(buffer)
            .resize({
                width: 200,
                height: 200
            })
            .toFormat("webp")
            .toFile(DIR + '/' + filename);


        //@ts-ignore
        req.filename = filename;
        return next();

    } catch (error) {
        console.error(error);
        return res.status(200).json({ log: 'Falha ao otimizar a imagem' })
    }
}