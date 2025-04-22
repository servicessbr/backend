"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_new_user_html_1 = __importDefault(require("../templates/admin-new-user.html"));
function emailOptions(code, to) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Sua conta foi criado com sucesso!',
        html: (0, admin_new_user_html_1.default)(String(code).toUpperCase()),
        attachments: [{
                filename: 'email_header.png',
                path: 'public/assets/email_header.png',
                cid: 'emailHeaderPNG'
            }]
    });
}
exports.default = emailOptions;
