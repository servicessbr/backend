import template from '../templates/admin-new-user.html';

function emailOptions(code:string, to:string) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to,
        subject: 'Sua conta foi criado com sucesso!',
        html: template(String(code).toUpperCase()),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

export default emailOptions;