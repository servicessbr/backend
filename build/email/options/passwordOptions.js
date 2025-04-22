"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_html_1 = __importDefault(require("../templates/password.html"));
function passwordOptions(token, to) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Solicitação pra trocar de senha',
        html: (0, password_html_1.default)(token),
        attachments: [{
                filename: 'email_header.png',
                path: 'public/assets/email_header.png',
                cid: 'emailHeaderPNG'
            }]
    });
}
exports.default = passwordOptions;
