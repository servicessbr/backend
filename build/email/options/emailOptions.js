"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_html_1 = __importDefault(require("../templates/email.html"));
function emailOptions(code, to) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: `Use o código ${String(code).toUpperCase()} para se autenticar!`,
        html: (0, email_html_1.default)(String(code).toUpperCase()),
        attachments: [{
                filename: 'email_header.png',
                path: 'public/assets/email_header.png',
                cid: 'emailHeaderPNG'
            }]
    });
}
exports.default = emailOptions;
