"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const Works_1 = __importDefault(require("../../models/Works"));
const sequelize_1 = require("sequelize");
/*
    * Confere se o usuário é dono do anúncio( work )
    * antes de deixar alterar.
    * É importante porque no próximo passa o work e os subworks
    * podem ser alterados separadamente ou paralelamente
    * isso dificulta a validação da autorização.
*/
const owner = async (req, res, next) => {
    const { work_id } = req.body;
    //@ts-ignore
    const uid = req.uid;
    if (!(work_id && uid))
        return res
            .status(401)
            .json({ message: 'work owner no no data' })
            .end();
    //@ts-ignore
    const owns = await Works_1.default.findOne({
        attributes: ['id'],
        where: {
            [sequelize_1.Op.and]: [{ id: work_id }, { user_uid: uid }]
        }
    }).catch((err) => (0, console_1.error)(err));
    /*
        * Se encontrar um work está autorizado pois o uid do jwt
        * corresponder com o dono do work que será alterado
        * poe causa da query "where id and uid".
    */
    if (!owns)
        return res
            .status(401)
            .json({ message: 'owner dont match error' })
            .end();
    return next();
};
exports.default = owner;
