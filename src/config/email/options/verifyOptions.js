const templateSuccess = require('../templates/verify-success.html');
const templateFailure = require('../templates/verify-failure.html');

function verifyOptions(to, switcher = 'success', user) {
    if (
        (switcher === 'success' && user && user.name && user.uid) ||
        (switcher === 'failure')
    )
        return ({
            from: 'Servicess <suporte@servicess.com.br>',
            to,
            subject: switcher === 'failure'
                ? 'Perfil não pode ser verificado'
                : 'Perfil verificada com sucesso',
            html: switcher === 'failure'
                ? templateFailure()
                : templateSuccess(String(user.uid), String(user.name)),
            attachments: [{
                filename: 'email_header.png',
                path: __dirname + '/images/email_header.png',
                cid: 'emailHeaderPNG'
            }]
        });
}

module.exports = verifyOptions;