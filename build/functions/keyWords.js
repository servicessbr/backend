"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const key_words_1 = __importDefault(require("../configs/constants/key_words"));
function keyWords(Q) {
    const result = [];
    for (let i in Q) {
        let uhuul = key_words_1.default.filter((list, idx) => {
            let r = false;
            list.map((word) => {
                let query = Q[i];
                if ((query.toLowerCase().substr(query.length - 1) === 'a') ||
                    (query.toLowerCase().substr(query.length - 1) === 'o'))
                    query = query.slice(0, query.length - 1);
                else if ((query.toLowerCase().substr(query.length - 2) === 'as') ||
                    (query.toLowerCase().substr(query.length - 2) === 'os'))
                    query = query.slice(0, query.length - 2);
                if (word.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "")
                    .search(query.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "")) === 0)
                    r = true;
            });
            return r;
        });
        result.push(uhuul);
    }
    const flatt = result.flat().flat();
    let uniqueChars = [];
    flatt.forEach((element) => {
        if (!uniqueChars.includes(element)) {
            uniqueChars.push(element);
        }
    });
    return uniqueChars;
}
exports.default = keyWords;
