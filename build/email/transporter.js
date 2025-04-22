"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
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
});
exports.default = transporter;
