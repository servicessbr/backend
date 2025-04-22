"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Evaluations_1 = __importDefault(require("../models/Evaluations"));
const Orders_1 = __importDefault(require("../models/Orders"));
const ordersController = {
    async list(req, res) {
        //@ts-ignore
        const uid = req.uid;
        //@ts-ignore
        const customersList = await Orders_1.default.sequelize.query(`SELECT orders.*, users.name 
                FROM orders
                LEFT JOIN users
                ON (users.uid = orders.payer_customer_uid)
                WHERE (
                    orders.provider_professional_uid = :provider_professional_uid
                    AND status = 'in_progress'
                );`, {
            replacements: { provider_professional_uid: uid },
            type: sequelize_1.QueryTypes.SELECT
        }).catch((err) => console.error(err));
        //@ts-ignore
        const professionalsList = await Orders_1.default.sequelize.query(`SELECT orders.*, users.profession 
                FROM orders
                LEFT JOIN users
                ON (users.uid = orders.provider_professional_uid)
                WHERE (
                    orders.payer_customer_uid = :payer_customer_uid
                    AND status = 'in_progress'
                );`, {
            replacements: { payer_customer_uid: uid },
            type: sequelize_1.QueryTypes.SELECT
        }).catch((err) => console.error(err));
        return res.status(200).json([professionalsList, customersList]).end();
    },
    async finalizeAndEvaluate(req, res) {
        //@ts-ignore
        const uid = req.uid;
        const { order_id } = req.params;
        const { stars, review_description } = req.body;
        if (!(uid && order_id))
            return res
                .status(400)
                .json({ message: 'finalize & evaluate error - data schema' })
                .end();
        //@ts-ignore
        await Orders_1.default.update({ status: 'finished' }, {
            where: {
                id: order_id,
                payer_customer_uid: uid
            },
        }).then(async (response) => {
            if (!(stars &&
                typeof stars === 'number' &&
                stars >= 1 && stars <= 5))
                return res
                    .status(204)
                    .json({ message: 'no review, no stars' })
                    .end();
            //@ts-ignore
            await Evaluations_1.default.create({
                id: order_id,
                stars, review_description
            });
            return res.status(200).end();
        });
    }
};
exports.default = ordersController;
