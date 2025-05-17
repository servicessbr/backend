"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const environment_1 = __importDefault(require("../configs/env/environment"));
const console_1 = require("console");
let options = {
    //@ts-ignore
    host: "smtpout.secureserver.net",
    secure: true,
    /*
        * TLS requires secureConnection to be false
    */
    secureConnection: false,
    tls: {
        ciphers: 'SSLv3'
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
        user: 'suporte@servicess.com.br',
        pass: process.env.MAIN_MAIL_PASSWORD
    }
};
const fake = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jordan.franecki16@ethereal.email',
        pass: '2t1r22s97CUjm4PJKW'
    }
};
switch (environment_1.default) {
    case '.env.development':
        options = fake;
        break;
    case '.env.stage':
        options = fake;
        break;
    case '.env.production.local':
        options = fake;
        break;
    default:
        break;
}
(0, console_1.log)('4) Mailer: ', options.auth.user);
const transporter = nodemailer_1.default.createTransport(options);
exports.default = transporter;
