"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
    * Models:
*/
const Cities_1 = __importDefault(require("../models/Cities"));
const locationsController = {
    async list(req, res) {
        const { location } = req.params;
        //@ts-ignore
        await Cities_1.default.findAll({
            attributes: ['name', 'id'],
            where: { state_id: location }
        })
            .then((data) => res.status(200).json(data))
            .catch((e) => {
            console.error(e);
            return res.status(500).json({ message: 'list cities error' });
        });
    }
};
exports.default = locationsController;
