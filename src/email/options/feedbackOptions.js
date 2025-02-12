const template = require('../templates/feedback.html');

function feedbackOptions(
    code,
    suggestion,
    uid,
    name,
    email,
    phone
) {
    return ({
        from: 'Servicess <suporte@servicess.com.br>',
        to: 'suporte@servicess.com.br',
        subject: `${code}`,
        html: template(code, suggestion, uid, name, email, phone),
        attachments: [{
            filename: 'email_header.png',
            path: 'public/assets/email_header.png',
            cid: 'emailHeaderPNG'
        }]
    });
}

module.exports = feedbackOptions;