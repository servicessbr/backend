 

const sharp = require('sharp');
const fs = require('fs');
const DIR = require('../../../public/constants/DIR.json');


const sharpAvatar = async (req: Request, res: Response, next: NextFunction) => {
    const uid = req.uid;

     
    if (!req.file && !req.file.buffer) return res.status(500).json({ msg: 'Sem imagem' });
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

         
        req.filename = filename;
        return next();

    } catch (error) {
        console.error(error);
        return res.status(200).json({ log: 'Falha ao otimizar a imagem' })
    }
}

export default {sharpAvatar}