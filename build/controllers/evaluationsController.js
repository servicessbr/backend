"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Evaluations_1 = __importDefault(require("../models/Evaluations"));
const evaluationsController = {
    async list(req, res) {
        //@ts-ignore
        const { provider_professional_uid } = req.params;
        //@ts-ignore
        const list = await Evaluations_1.default.sequelize.query(`SELECT DISTINCT ON (o.payer_customer_uid) e.id, e.stars, e.review_description, 
            o.payer_customer_uid, o.provider_professional_uid, 
            u.name as payer_customer_name
            FROM evaluations as e
            LEFT JOIN orders as o
            ON (e.id = o.id)
            LEFT JOIN users as u
            ON (o.payer_customer_uid = u.uid)
            WHERE (o.provider_professional_uid = :provider_professional_uid)
            LIMIT 6;`, {
            replacements: { provider_professional_uid },
            type: sequelize_1.QueryTypes.SELECT
        });
        return res.status(200).json(list).end();
    }
};
exports.default = evaluationsController;
