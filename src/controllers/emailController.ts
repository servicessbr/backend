
import transporter from '../email/transporter';

// Options:
import emailOptions from '../email/options/emailOptions';
import passwordOptions from '../email/options/passwordOptions';
import { Request, Response } from 'express';

const emailController = {
    newUser(req: Request, res: Response) {
        const { email } = req.params;

        //@ts-ignore
        const code = req.code;

        transporter.sendMail(
            emailOptions(code, email.trim().toLowerCase()),
            function (err: Error | null | null, info: any

            ) {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ message: 'send email error 1' })
                } else {
                    return res.status(200).end();
                }
            });
    },

    utoken(req: Request, res: Response) {

        //@ts-ignore
        const email = req.email;

        //@ts-ignore
        const utoken = req.utoken;

        transporter.sendMail(
            passwordOptions(utoken, email),
            function (err: Error | null | null, info: any) {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ message: 'send email error 2' })
                } else {
                    return res.status(200).end();
                }
            });
    }
}

export default emailController;
