
import Chat_Channel from "../schemas/Chat_Channel";
import { Request, Response } from 'express';

const channelController = {
    async channel(req: Request, res: Response) {
        const { expoPushToken } = req.body;
        //@ts-ignore
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

export default channelController;