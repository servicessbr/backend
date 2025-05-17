"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePro = void 0;
require("dotenv/config");
const console_1 = require("console");
const transporter_1 = __importDefault(require("../email/transporter"));
const Users_1 = __importDefault(require("../models/Users"));
const voucherOptions_1 = __importDefault(require("../email/options/voucherOptions"));
const addOneYear_1 = __importDefault(require("../functions/addOneYear"));
const priceTag_1 = require("../configs/constants/priceTag");
const makePro = async (res, user_uid, transaction) => {
    //console.log('in! makePro!');
    //@ts-ignore
    const user = await Users_1.default.findOne({
        where: { uid: user_uid },
        attributes: ['pro', 'vip']
    }).catch(err => (0, console_1.error)(err));
    //@ts-ignore
    const { pro, vip } = user;
    //console.log('VIP & PRO', vip, pro);
    let update = { vip, pro };
    //console.log('Transaction AMOUNT: ', transaction.amount, typeof transaction.amount);
    //console.log('PRE_PAYMENT: ', PRE_PAYMENT, typeof transaction.amount);
    //console.log('COMPARE: ', (transaction.amount === PRE_PAYMENT), (`${transaction.amount}` === `${PRE_PAYMENT}`))
    switch (transaction.amount) {
        case priceTag_1.PRO_PAYEMNT:
            update = {
                pro: (0, addOneYear_1.default)(pro, 'pro')
            };
            break;
        case priceTag_1.PRE_PAYMENT:
            update = {
                vip: (0, addOneYear_1.default)(pro, 'pre')
            };
            break;
        case priceTag_1.VIP_PAYMENT:
            update = {
                vip: (0, addOneYear_1.default)(pro, 'vip')
            };
            break;
        default:
            break;
    }
    //console.log('VIP: ', update);
    //@ts-ignore
    await Users_1.default.update(update, { where: { uid: user_uid } })
        .then(async () => {
        try {
            transporter_1.default.sendMail((0, voucherOptions_1.default)(
            //@ts-ignore
            transaction.email, transaction.id, user_uid, transaction.date_approved, transaction.amount, 
            //@ts-ignore
            transaction.name), function (err, info) {
                if (err) {
                    console.error(err);
                }
            });
        }
        catch (err) {
            console.error('Payment | Push or E-mail Error: ', err);
        }
        ;
        return res.status(200).end();
    })
        .catch((err) => {
        (0, console_1.error)(err);
        return res
            .status(500)
            .json({ message: 'make pro error - create pro' })
            .end();
    });
};
exports.makePro = makePro;
