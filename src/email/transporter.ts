import 'dotenv/config';
import nodemailer from 'nodemailer';
import environment from '../configs/env/environment';
import { log } from 'console';

let options = {
    //@ts-ignore
    host: "smtpout.secureserver.net",
    secure: true,
    /* 
        * TLS requires secureConnection to be false
    */
    secureConnection: false,
    tls: {
        ciphers: 'SSLv3'
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
        user: 'suporte@servicess.com.br',
        pass: process.env.MAIN_MAIL_PASSWORD
    }
}

const fake = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jordan.franecki16@ethereal.email',
        pass: '2t1r22s97CUjm4PJKW'
    }
}

switch (environment) {
    case '.env.development':
        options = fake as typeof options
        break;
    case '.env.stage':
        options = fake as typeof options
        break;
    case '.env.production.local':
        options = fake as typeof options
        break;

    default:
        break;
}

log('4) Mailer: ', options.auth.user);

const transporter = nodemailer.createTransport(options);

export default transporter;
