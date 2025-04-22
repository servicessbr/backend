"use strict";
/*
    * Public
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharpAvatar = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const DIR_1 = __importDefault(require("../../configs/constants/DIR"));
const sharpAvatar = async (req, res, next) => {
    //@ts-ignore
    const uid = req.uid;
    if (!(req.file && req.file.buffer))
        return res.status(500).json({ msg: 'Sem imagem' });
    if (!uid)
        return res.status(500).json({ msg: 'Sem usuário' });
    const buffer = req.file.buffer;
    const filename = uid + '.webp';
    fs_1.default.access(DIR_1.default, (err) => err && fs_1.default.mkdirSync(DIR_1.default));
    try {
        await (0, sharp_1.default)(buffer)
            .resize({
            width: 200,
            height: 200
        })
            .toFormat("webp")
            .toFile(DIR_1.default + '/' + filename);
        //@ts-ignore
        req.filename = filename;
        return next();
    }
    catch (error) {
        console.error(error);
        return res.status(200).json({ log: 'Falha ao otimizar a imagem' });
    }
};
exports.sharpAvatar = sharpAvatar;
