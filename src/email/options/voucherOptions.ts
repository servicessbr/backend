import template from '../templates/voucher.html';

function voucherOptions(
    to: any,
    operation_number: any,

    user_uid: any,
    date_approved: any,
    transaction_amount: any,
    user_name: any

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

export default voucherOptions;