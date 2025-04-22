"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    * Verifique se a string contém apenas dígitos.
*/
const stringContainsOnlyDigits = (string) => /^\d+$/.test(string);
exports.default = stringContainsOnlyDigits;
