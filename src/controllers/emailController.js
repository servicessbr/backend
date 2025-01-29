
const transporter = require('../email/transporter');

// Options:
const emailOptions = require('../email/options/emailOptions');
const passwordOptions = require('../email/options/passwordOptions');

const emailController = {
    newUser(req, res) {
        const { email } = req.params;
         
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
         
        const email = req.email;
         
        const utoken = req.utoken;

        transporter.sendMail(passwordOptions(utoken, email), function (err, info) {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'send email error 2' })
            } else {
                return res.status(200).end();
            }
        });
    }
}

module.exports = emailController;
