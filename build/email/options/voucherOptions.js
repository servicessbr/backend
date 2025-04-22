"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_html_1 = __importDefault(require("../templates/voucher.html"));
function voucherOptions(to, operation_number, user_uid, date_approved, transaction_amount, user_name) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Agradecemos pela sua compra',
        html: (0, voucher_html_1.default)(operation_number, user_uid, date_approved, transaction_amount, user_name),
        attachments: [{
                filename: 'email_header.png',
                path: 'public/assets/email_header.png',
                cid: 'emailHeaderPNG'
            }]
    });
}
exports.default = voucherOptions;
