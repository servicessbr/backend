"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_html_1 = __importDefault(require("../templates/payment.html"));
function paymentOptions(to, original_subwork_title, payer_customer_name, not_me, transaction_amount, execution_date) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'O agendamento foi realizado',
        html: (0, payment_html_1.default)(original_subwork_title, payer_customer_name, not_me, transaction_amount, execution_date),
        attachments: [{
                filename: 'email_header.png',
                path: 'public/assets/email_header.png',
                cid: 'emailHeaderPNG'
            }]
    });
}
exports.default = paymentOptions;
