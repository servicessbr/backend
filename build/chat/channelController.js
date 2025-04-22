"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chat_Channel_1 = __importDefault(require("../schemas/Chat_Channel"));
const channelController = {
    async channel(req, res) {
        const { expoPushToken } = req.body;
        //@ts-ignore
        const uid = req.uid;
        if (!(uid && expoPushToken))
            return;
        const Channel = await Chat_Channel_1.default.findOne({ uid });
        if (Channel) {
            Channel.ExponentPushToken = expoPushToken;
            await Channel.save()
                .then(() => res.status(200).end())
                .catch((e) => {
                console.error(e);
                return res.status(500).end();
            });
        }
        else {
            await Chat_Channel_1.default.create({
                uid,
                ExponentPushToken: expoPushToken
            })
                .then(() => res.status(200).end())
                .catch((e) => {
                console.error(e);
                return res.status(500).end();
            });
        }
    }
};
exports.default = channelController;
