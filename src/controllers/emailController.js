
const transporter = require('../config/email/transporter');

// Options:
const emailOptions = require('../config/email/options/emailOptions');
const passwordOptions = require('../config/email/options/passwordOptions');
const messageOptions = require('../config/email/options/messageOptions');

const emailController = {
    newUser(req, res) {
        const { email } = req.params;
        /*@ts-ignore*/
        const code = req.code;

        transporter.sendMail(emailOptions(code, email.trim().toLowerCase()), function (err, info) {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'send email error 1' })
            } else {
                return res.status(200).end();
            }
        });
    },

    utoken(req, res) {
        /*@ts-ignore*/
        const email = req.email;
        /*@ts-ignore*/
        const utoken = req.utoken;

        transporter.sendMail(passwordOptions(utoken, email), function (err, info) {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'send email error 2' })
            } else {
                return res.status(200).end();
            }
        });
    },

    message(req, res) {
        const { message, name, email, phone } = req.body;
        /*@ts-ignore*/
        const prof_email = req.prof_email;
        /*@ts-ignore*/
        const prof_name = req.prof_name;

        transporter.sendMail(messageOptions(message, name, email, phone, prof_name, prof_email), function (err, info) {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'send email error 3' })
            } else {
                return res.status(200).end();
            }
        });
    }
}

module.exports = emailController;
