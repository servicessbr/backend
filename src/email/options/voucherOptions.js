const template = require('../templates/voucher.html');

function voucherOptions(
    to,
    operation_number,

    user_uid,
    date_approved,
    transaction_amount,
    user_name
   
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Agradecemos pela sua compra',
        html: template(
            operation_number,
        
            user_uid,
            date_approved,
            transaction_amount,
            user_name
        ),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = voucherOptions;