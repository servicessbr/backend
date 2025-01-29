const template = require('../templates/partner.html');

function partnerOptions(name, email) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to: email,
        subject: 'Agradecemos pela sua avaliação!',
        html: template(name),
        attachments: [{
            filename: 'email_header.png',
            path: __dirname + '/images/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = partnerOptions;