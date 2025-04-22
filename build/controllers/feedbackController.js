"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transporter_1 = __importDefault(require("../email/transporter"));
const feedbackOptions_1 = __importDefault(require("../email/options/feedbackOptions"));
const Feedback_1 = __importDefault(require("../schemas/Feedback"));
const feedbackController = {
    async make(req, res) {
        const { uid, suggestion, evaluation, code, name, email, phone, } = req.body;
        await Feedback_1.default.create({
            uid,
            suggestion,
            evaluation,
            code,
            name,
            email,
            phone
        }).catch((err) => console.error(err));
        transporter_1.default.sendMail((0, feedbackOptions_1.default)(code, suggestion, uid, name, email, phone), function (err, info) {
            if (err) {
                console.error(err);
                return res.status(200).end();
            }
            else {
                return res.status(200).end();
            }
        });
    }
};
exports.default = feedbackController;
