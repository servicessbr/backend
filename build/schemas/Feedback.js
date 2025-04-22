"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    uid: {
        type: String,
        required: false,
        unique: false
    },
    suggestion: {
        type: String,
        required: false,
        unique: false
    },
    evaluation: {
        type: String,
        required: false,
        unique: false
    },
    code: {
        type: String,
        required: false,
        unique: false
    },
    name: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    phone: {
        type: String,
        required: false,
        unique: false
    }
});
const Feedback = mongoose_1.default.model('Feedback', feedbackSchema);
exports.default = Feedback;
