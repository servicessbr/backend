import template from '../templates/payment.html';

function paymentOptions(
    to: any,
    original_subwork_title: any,
    payer_customer_name: any,
    not_me: any,
    transaction_amount: any,
    execution_date: any
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'O agendamento foi realizado',
        html: template(original_subwork_title, payer_customer_name, not_me, transaction_amount, execution_date),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

export default paymentOptions;