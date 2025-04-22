"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transporter_1 = __importDefault(require("../email/transporter"));
// Options:
const emailOptions_1 = __importDefault(require("../email/options/emailOptions"));
const passwordOptions_1 = __importDefault(require("../email/options/passwordOptions"));
const emailController = {
    newUser(req, res) {
        const { email } = req.params;
        //@ts-ignore
        const code = req.code;
        transporter_1.default.sendMail((0, emailOptions_1.default)(code, email.trim().toLowerCase()), function (err, info) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'send email error 1' });
            }
            else {
                return res.status(200).end();
            }
        });
    },
    utoken(req, res) {
        //@ts-ignore
        const email = req.email;
        //@ts-ignore
        const utoken = req.utoken;
        transporter_1.default.sendMail((0, passwordOptions_1.default)(utoken, email), function (err, info) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'send email error 2' });
            }
            else {
                return res.status(200).end();
            }
        });
    }
};
exports.default = emailController;
