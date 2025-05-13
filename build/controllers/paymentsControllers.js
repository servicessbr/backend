"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePro = exports.createOrder = void 0;
require("dotenv/config");
const console_1 = require("console");
const pushNotifications_1 = __importDefault(require("../mobile/pushNotifications"));
/*
    * Models
*/
const Orders_1 = __importDefault(require("../models/Orders"));
const transporter_1 = __importDefault(require("../email/transporter"));
const Chat_Channel_1 = __importDefault(require("../schemas/Chat_Channel"));
const paymentOptions_1 = __importDefault(require("../email/options/paymentOptions"));
const redisConfig_1 = require("../configs/cache/redisConfig");
const Users_1 = __importDefault(require("../models/Users"));
const voucherOptions_1 = __importDefault(require("../email/options/voucherOptions"));
const createOrder = async (res, data, removeRadisKey) => {
    if (!(data &&
        data.payer_customer_uid &&
        data.payer_customer_name &&
        data.payer_customer_email &&
        data.provider_professional_uid &&
        data.provider_professional_name &&
        data.provider_professional_email &&
        data.execution_date &&
        data.transaction_amount &&
        data.original_subwork_title))
        return res
            .status(400)
            .json({ message: 'make payment erro - schema validation failed' })
            .end();
    //@ts-ignore
    await Orders_1.default.create({
        status: 'in_progress',
        ...data
    })
        .then(async () => {
        try {
            const channel = await Chat_Channel_1.default.find({
                uid: [
                    data.payer_customer_uid,
                    data.provider_professional_uid
                ]
            });
            console.log('channel: ', channel);
            channel[0] && (0, pushNotifications_1.default)([
                {
                    to: channel[0].ExponentPushToken,
                    sound: 'default',
                    body: '🔔 O agendamento foi realizado!',
                    data: {}
                }
            ]);
            channel[1] && (0, pushNotifications_1.default)([
                {
                    to: channel[1].ExponentPushToken,
                    sound: 'default',
                    body: '🔔 O agendamento foi realizado!',
                    data: {}
                }
            ]);
            transporter_1.default.sendMail((0, paymentOptions_1.default)(data.provider_professional_email, data.original_subwork_title, data.payer_customer_name, data.payer_customer_name, data.transaction_amount, data.execution_date), function (err, info) {
                if (err) {
                    console.error(err);
                }
            });
            transporter_1.default.sendMail((0, paymentOptions_1.default)(data.payer_customer_email, data.original_subwork_title, data.payer_customer_name, data.provider_professional_name, data.transaction_amount, data.execution_date), function (err, info) {
                if (err) {
                    console.error(err);
                }
            });
            removeRadisKey && await (0, redisConfig_1.removeCache)(removeRadisKey);
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
            .json({ message: 'make order error - create order' })
            .end();
    });
};
exports.createOrder = createOrder;
const makePro = async (res, user_uid, transaction) => {
    //@ts-ignore
    await Users_1.default.update({
        pro: true
    }, { where: { uid: user_uid } })
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
