"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addOneYear;
function addOneYear(date, plan) {
    const DATE = (date instanceof Date)
        ? new Date(date)
        : new Date();
    const newDATE = (plan === 'pre')
        ? DATE.setMonth(DATE.getMonth() + 1)
        : DATE.setFullYear(DATE.getFullYear() + 1);
    return new Date(newDATE);
}
