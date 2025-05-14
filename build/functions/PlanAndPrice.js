"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlanAndPrice;
const priceTag_1 = require("../configs/constants/priceTag");
function PlanAndPrice(plan) {
    let r = false;
    switch (plan) {
        case 'pro':
            r = {
                plan: 'pro',
                price: priceTag_1.PRO_PAYEMNT
            };
            break;
        case 'vip':
            r = {
                plan: 'vip',
                duration: 'annually',
                price: priceTag_1.VIP_PAYMENT
            };
            break;
        case 'pre':
            r = {
                plan: 'vip',
                duration: 'monthly',
                price: priceTag_1.PRE_PAYMENT
            };
            break;
        default:
            break;
    }
    return r;
}
