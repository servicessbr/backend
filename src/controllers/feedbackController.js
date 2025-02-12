
const transporter = require('../email/transporter');
const feedbackOptions = require('../email/options/feedbackOptions');
const Feedback = require('../schemas/Feedback');
//import Feedback from "../schemas/Feedback";

const feedbackController = {
    async make(req, res) {

        const {
            uid,
            suggestion,
            evaluation,

            code,
            name,
            email,
            phone,

        } = req.body;

        await Feedback.create({
            uid,
            suggestion,
            evaluation

        }).catch(err => console.error(err));

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

module.exports = feedbackController;