"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const removeNotDigitsFromString_1 = __importDefault(require("../functions/onlyDigits/removeNotDigitsFromString"));
const regexEP_1 = __importDefault(require("../functions/regexEP"));
const Users_1 = __importDefault(require("../models/Users"));
const console_1 = require("console");
async function updatePhone(req, res, next) {
    //@ts-ignore
    const uid = req.uid;
    const { phone } = req.body;
    if (!(phone && uid))
        return next();
    const phoneNumber = (0, removeNotDigitsFromString_1.default)(phone);
    //@ts-ignore
    if (regexEP_1.default.phone.test(phoneNumber))
        await Users_1.default.update({ phone: phoneNumber }, { where: { uid } })
            .then(() => res.set('X-updated-phone', 'true'))
            .catch((err) => (0, console_1.error)(err));
    /*
        * Informa o client que o phone foi alterado.
    */
    return next();
}
exports.default = updatePhone;
