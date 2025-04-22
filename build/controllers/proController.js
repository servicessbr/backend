"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proController = {
    isPro(req, res) {
        //@ts-ignore
        const pro = req.pro;
        return res.status(200).json({ isPro: pro }).end();
    }
};
exports.default = proController;
