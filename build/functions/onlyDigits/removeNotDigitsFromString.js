"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeNotDigitsFromString = (string) => `${string}`.replace(/\D/g, '');
exports.default = removeNotDigitsFromString;
