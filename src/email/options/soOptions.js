const template = require('../templates/so.html');

function serviceOrdersOptions(
    to, type,
    client_name, payment_amount,
    location,
    hour, day,
    week, month
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Serviço contratado com sucesso!',
        html: template(type, client_name, payment_amount, location, hour, day, week, month),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = serviceOrdersOptions;