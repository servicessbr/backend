
const Chat_Channel = require("../schemas/Chat_Channel");

const channelController = {
    async channel(req, res) {
        const { expoPushToken } = req.body;
        const uid = req.uid;

        if (!(uid && expoPushToken)) return;

        const Channel = await Chat_Channel.findOne({ uid });

        if (Channel) {

            Channel.ExponentPushToken = expoPushToken;

            await Channel.save()
                .then(() => res.status(200).end())
                .catch((e) => {
                    console.error(e)
                    return res.status(500).end()
                });

        } else {
            await Chat_Channel.create({
                uid,
                ExponentPushToken: expoPushToken
            })
                .then(() => res.status(200).end())
                .catch((e) => {
                    console.error(e)
                    return res.status(500).end()
                });
        }
    }
}

module.exports = channelController;