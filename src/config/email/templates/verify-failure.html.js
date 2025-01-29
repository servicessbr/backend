module.exports = () =>
    `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conta criada com sucesso</title>
        <style>
            html {
                font-family: sans-serif;
            }
    
            table {
                border: 1px solid #DEE6EB;
                border-radius: 8px;
                background-color: white;
            }
    
            .start {
                border-radius: 8px 8px 0 0;
            }
    
            .end {
                border-radius: 0 0 8px 8px;
            }
    
            h3 {
                color: #222D36;
                text-align: center;
                width: 80%;
                font-size: 22px;
                text-transform: uppercase;
            }
    
            .title {
    
                display: flex;
                align-items: center;
            }
    
            .center {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
    
            .title h2 {
                font-size: 20.5px;
                font-family: 'Montserrat', sans-serif;
            }
    
            .title span {
                font-weight: 100;
                font-size: 17px;
            }
    
            .title h2,
            .title span {
                margin: 0;
                color: #222D36;
            }
    
            .title {
                overflow: hidden;
                display: flex;
                align-items: center;
            }
    
            .title img {
                width: 100%;
                border-radius: 8px;
                margin: 0;
                padding: 0;
                top: 0;
                z-index: 999;
            }
    
            .td {
                background-color: #fff;
                padding: 0 10%;
                width: 80%;
                text-align: center;
            }
    
            .td p {
                color: #222D3690;
                padding: 30px 0;
            }
    
            .td span {
                color: #222D36;
                font-size: 2.4em;
                padding: 50px 0;
                letter-spacing: 6px;
            }
    
            .td h6 {
                border-top: 1px solid #222D3620;
                color: #222D3680;
                padding: 30px 0 0 0;
                font-size: 12px;
                margin: 0;
            }
    
            .td h5 {
                margin: 0;
                padding: 0 0 30px 0;
                color: #222D3680;
                font-size: 12px;
            }
    
            button {
                background-color: #00AE74;
                border-style: none;
                border-radius: 100px;
                padding: 20px 60px;
                color: #fff;
                font-weight: bold;
                margin-top: 30px;
            }
    
            .strong {
                color: white;
                background-color: dodgerblue;
                border-radius: 100%;
                padding: 2px 4px;
            }
    
            #bullet {
                text-align: left;
                padding: 30px 0 0 40px;
                margin: 0;
            }
    
            #bullet-title {
                margin: 0;
                padding: 60px 0 0 0;
            }
        </style>
    </head>
    
    <body>
        <table align="center" cellpadding="0" cellspacing="0" width="600">
            <tr style="position: relative;">
                <td class="start" style="height: 20px;">
                    <div class="title">
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            <img src="cid:emailHeaderPNG" />
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px 0 0 0;">
                    <h3>verificação de perfil</h3>
                </td>
            </tr>
            <tr>
                <td class='td'>
                    <p id='bullet-title'>Seu perfil não pode ser verificado, as possíveis causas são:</p>
                    <p id='bullet'>&#8226; <strong>Imagem com baixa resolução ou borrada:</strong> Não foi possível enxergar
                        as informações.</p>
                    <p id='bullet'>&#8226; <strong>Apenas um dos lados do documento foi enviado:</strong> Faltam dados
                        importantes.</p>
                    <p id='bullet'>&#8226; Os dados do documento não estão em conformidade com os do seu perfil, entre
                        outras.</p>
                </td>
            </tr>
            <tr>
                <td class='td'>
                    <a href="http://www.servicess.com.br/registration#3"><button>REENVIAR DOCUMENTOS</button></a>
                </td>
            </tr>
            <tr>
                <td class='td'>
                    <p>
                        Por favor reenvie os documentos:
                        <br /><br />
                        <strong>Menu &rArr; Dados pessoais &rArr; Perfil verificado</strong>
                    </p>
    
                </td>
            </tr>
            <tr>
                <td class='td end'>
                    <h6>Com dúvidas? Entre em contato conosco.</h6>
                    <br />
                    <h5>© 2024 Servicess LTDA.</h5>
                </td>
            </tr>
        </table>
    </body>
    
    </html>

`