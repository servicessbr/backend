"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJson(str) {
    try {
        JSON.parse(str);
    }
    catch (err) {
        return false;
    }
    return true;
}
;
exports.default = isJson;
