"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const console_1 = require("console");
/*
    * Models:
*/
const Works_1 = __importDefault(require("../models/Works"));
const tmpController = {
    async premium(req, res) {
        //@ts-ignore
        await Works_1.default.sequelize.query(`SELECT 
            DISTINCT ON (users.uid) 
            works.id, works.title, works.discount, works.banner,
            works.price, works.description, cities.name as city, 
            users.uid, users.name, users.verified,users.profession 
            FROM works
            INNER JOIN users
            ON (works.user_uid = users.uid)
            INNER JOIN cities 
            ON (works.city_id = cities.id) 
            LEFT JOIN premiums 
            ON (works.user_uid = premiums.user_uid) 
            WHERE (premiums.expiration > now())
            LIMIT 9;`, {
            type: sequelize_1.QueryTypes.SELECT
        })
            .then((list) => res.status(200).json(list))
            .catch((err) => {
            (0, console_1.error)(err);
            return res
                .status(500)
                .json({ message: 'premium list cards error' });
        });
    }
};
exports.default = tmpController;
