const template = require('../templates/email.html');

function emailOptions(code, to) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: `Use o código ${String(code).toUpperCase()} para se autenticar!`,
        html: template(String(code).toUpperCase()),
        attachments: [{
            filename: 'email_header.png',
            path: __dirname + '/images/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = emailOptions;