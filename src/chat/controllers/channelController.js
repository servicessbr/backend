
const Chat_Channel = require("../../schemas/Chat_Channel");

const channelController = {
    async channel(req, res) {
        console.log('innn! server')
        const { expoPushToken } = req.body;
        const uid = req.uid;

        console.log('expoPushToken ', uid, expoPushToken)

        if (!(uid && expoPushToken)) return;

        console.log('EXPO: ', { uid, expoPushToken })

        const Channel = await Chat_Channel.findOne({ uid });

        console.log('Channel: ', Channel)

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