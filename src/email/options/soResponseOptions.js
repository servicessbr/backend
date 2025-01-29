const template = require('../templates/soResponse.html');

function soResponseOptions(
    to, prof_name
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'O orçamento ficou pronto!',
        html: template(prof_name),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = soResponseOptions;