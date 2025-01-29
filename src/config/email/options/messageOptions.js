const template = require('../templates/message.html');

function messageOptions(message, name, email, phone, prof_name, prof_email) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to: prof_email,
        subject: `${prof_name}, tem mensagem para você!`,
        html: template(message, name, email, phone, prof_name),
        attachments: [{
            filename: 'email_header.png',
            path: __dirname + '/images/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = messageOptions;