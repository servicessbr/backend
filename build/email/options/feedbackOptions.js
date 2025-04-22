"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feedback_html_1 = __importDefault(require("../templates/feedback.html"));
function feedbackOptions(code, suggestion, uid, name, email, phone) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to: 'servicessinbox@gmail.com',
        subject: `${code}`,
        html: (0, feedback_html_1.default)(code, suggestion, uid, name, email, phone),
        attachments: [{
                filename: 'email_header.png',
                path: 'public/assets/email_header.png',
                cid: 'emailHeaderPNG'
            }]
    });
}
exports.default = feedbackOptions;
