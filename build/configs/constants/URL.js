"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_PAYPAL_BASE = exports.URL_REACT_CLIENT = exports.URL_MERCADO_PAGO = exports.URL_HEROKU_SERVER = void 0;
const isLocalEnv_1 = __importDefault(require("../../functions/isLocalEnv"));
const console_1 = require("console");
exports.URL_HEROKU_SERVER = 'https://servicess-04d4b6080f33.herokuapp.com';
exports.URL_MERCADO_PAGO = "https://api.mercadopago.com";
exports.URL_REACT_CLIENT = !(0, isLocalEnv_1.default)()
    ? 'https://servicess.com.br'
    : 'http://localhost:3000';
exports.URL_PAYPAL_BASE = !(0, isLocalEnv_1.default)()
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
(0, console_1.log)('2)', exports.URL_REACT_CLIENT, exports.URL_PAYPAL_BASE);
