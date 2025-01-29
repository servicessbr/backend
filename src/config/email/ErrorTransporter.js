require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.MAIL_CLIENT_ID,
    process.env.MAIL_SECRET,
    'https://developers.google.com/oauthplayground'
);
oAuth2Client.setCredentials({ refresh_token: process.env.MAIL_REFRESHTOKEN });

const accessToken = oAuth2Client.getAccessToken();

const mailTransport = nodemailer.createTransport({
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

function errorOptions(code, log, data, route) {
    return ({
        from: 'Error Handler <suporte@servicess.com.br',
        to: 'servicesserrorhandler@gmail.com',
        subject: 'Ocorreu um erro!',
        html:
            `<!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Log de erros</title>
                    <style>
                    strong {
                        color: #70ba2a;
                        margin-left: 10px;
                    }
            
                    span {
                        color: #f0d535;
                        font-weight: bold;
                    }
            
                    i {
                        color: #6e6b66;
                        margin-right: 20px;
                    }
            
                    code {
                        white-space: pre-wrap;
                        overflow-wrap: break-word;
                        background-color: #292929;
                    }
                </style>
            </head>
            
            <body>
                <div
                    style="min-width:400px;width:fit-content;padding: 60px;background-color: #292929; color: white;font-family: sans-serif;">
                    <p><i>0</i>&#123;</p>
                    <p><i>1</i><strong>code</strong>: <span>${code ? code : ''}</span>,</p>
                    <p><i>2</i><strong>log</strong>: <span>${log ? log : ''}</span>,</p>
                    <p><i>3</i><strong>data</strong>: <span><code>${data ? JSON.stringify(data || {}) : {}}</code></span>,</p>
                    <p><i>4</i><strong>route</strong>: <span>${route ? route : ''}</span></p>
                    <p><i>5</i>&#125;</p>
                </div>
            </body>

            </html>`
    });
}
module.exports = (code = '', log = '', data = {}, route = '') => mailTransport.sendMail(errorOptions(code, log, data, route), function (err, info) {
    if (err) {
        console.error(err)
    }
});
