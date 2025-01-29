/*require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis')

const oAuth2Client = new google.auth.OAuth2(
    process.env.MAIL_CLIENT_ID,
    process.env.MAIL_SECRET,
    'https://developers.google.com/oauthplayground'
);
oAuth2Client.setCredentials({ refresh_token: process.env.MAIL_REFRESHTOKEN });

const accessToken = oAuth2Client.getAccessToken();

module.exports = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_SECRET,
        refreshToken: process.env.MAIL_REFRESHTOKEN,
        accessToken: accessToken.token
    }
});
*/


require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    /*@ts-ignore*/
    host: "smtpout.secureserver.net",
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
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
