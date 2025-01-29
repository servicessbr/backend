const template = require('../templates/premium.html');

function premiumOptions(
    operation_number,
    user_name,
    user_uid,
    date_approved,
    transaction_amount,
    to
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Agradecemos pela sua compra',
        html: template(
            operation_number,
            user_name,
            user_uid,
            date_approved,
            transaction_amount
        ),
        attachments: [{
            filename: 'email_header.png',
            path: __dirname + '/images/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = premiumOptions;