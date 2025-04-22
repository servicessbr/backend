"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../models/Users"));
const sequelize_1 = require("sequelize");
const chatList = async (list) => {
    const onlyUidList = list.map((it) => it.receiver);
    //@ts-ignore
    const newList = await Users_1.default.findAll({
        raw: true,
        attributes: ['profession', 'name', 'uid'],
        where: {
            uid: {
                [sequelize_1.Op.in]: onlyUidList
            }
        }
    });
    const readyList = list.map((t1) => ({ ...t1, ...newList.find((t2) => t2.uid === t1.receiver) }));
    return readyList;
};
exports.default = chatList;
