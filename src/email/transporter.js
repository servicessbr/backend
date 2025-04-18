require('dotenv').config();
const nodemailer = require('nodemailer');

var mailConfig;


// all emails are delivered to destination
mailConfig = {
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
};


console.log(process.env.NODE_ENV, mailConfig);

const transporter = nodemailer.createTransport(mailConfig);

module.exports = transporter;
