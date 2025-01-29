const template = require('../templates/soIntention.html');

function serviceOrdersIntentionsOptions(
    to,
    prof_name, client_name,
    d_date, d_hours, d_location,
    description
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Nova ordem de serviço!',
        html: template(
            prof_name, client_name,
            d_date, d_hours, d_location,
            description
        ),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = serviceOrdersIntentionsOptions;