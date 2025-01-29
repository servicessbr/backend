const template = require('../templates/admin-new-user.html');

function emailOptions(code, to) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Sua conta foi criado com sucesso!',
        html: template(String(code).toUpperCase()),
        attachments: [{
            filename: 'email_header.png',
            path: __dirname + '/images/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = emailOptions;