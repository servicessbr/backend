
import transporter from '../email/transporter';
import feedbackOptions from '../email/options/feedbackOptions';
import Feedback from '../schemas/Feedback';
//import Feedback from "../schemas/Feedback";
import { Request, Response } from 'express';

const feedbackController = {
    async make(req:Request, res:Response) {

        const {
            uid,
            suggestion,
            evaluation,

            code,
            name,
            email,
            phone,

        }:any = req.body;

        await Feedback.create({
            uid,
            suggestion,
            evaluation,
            code, 
            name, 
            email, 
            phone

        }).catch((err:Error )=> console.error(err));

        transporter.sendMail(feedbackOptions(code, suggestion, uid, name, email, phone), function (err, info) {
            if (err) {
                console.error(err)
                return res.status(200).end();
            } else {
                return res.status(200).end();
            }
        });
    }
}

export default feedbackController;