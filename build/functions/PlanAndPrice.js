"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlanAndPrice;
function PlanAndPrice(plan) {
    let r = false;
    switch (plan) {
        case 'pro':
            r = {
                plan: 'pro',
                price: 19.9
            };
            break;
        case 'vip':
            r = {
                plan: 'vip',
                duration: 'annually',
                price: 39.9
            };
            break;
        case 'pre':
            r = {
                plan: 'vip',
                duration: 'monthly',
                price: 6.9
            };
            break;
        default:
            break;
    }
    return r;
}
