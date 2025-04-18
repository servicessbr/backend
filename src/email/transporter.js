require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
     
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
});

module.exports = transporter;
