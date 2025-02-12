const template = require('../templates/payment.html');

function paymentOptions(
    to,
    original_subwork_title,
    payer_customer_name,
    not_me,
    payment_amount,
    execution_date
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'O agendamento foi realizado',
        html: template(original_subwork_title, payer_customer_name, not_me, payment_amount, execution_date),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = paymentOptions;