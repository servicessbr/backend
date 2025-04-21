import template from '../templates/password.html';

function passwordOptions(token: any, to: any) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Solicitação pra trocar de senha',
        html: template(token),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

export default passwordOptions;