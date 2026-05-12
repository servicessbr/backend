export default (code:any) =>
    `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Criar conta</title>
        <style>
            :root {
                color-scheme: only light;
            }
    
            html {
                font-family: sans-serif;
            }
    
            table {
                border: 1px solid #DEE6EB;
                border-radius: 7px;
                background-color: white;
            }
    
            .start {
                border-radius: 8px 8px 0 0;
            }
    
            .end {
                border-radius: 0 0 8px 8px;
            }
    
            h3 {
                color: #fff;
                text-align: center;
                width: 80%;
                font-size: 22px;
                color: #222D36;
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
                color: #222D3680;
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
                <td align="center"style="padding: 20px 0 0 0;">
                    <h3>Use o código abaixo para se autenticar:</h3>
                </td>
            </tr>
            <tr>
                <td class='td'>
    
                    <p>Olá, este dado é exclusivo para que você possa acessar sua conta. Ninguém da Servicess
                        jamais o pedirá em qualquer situação.</p>
                </td>
            </tr>
            <tr>
                <td class='td'>
                    <span>${code}</span>
                </td>
            </tr>
            <tr>
                <td class='td'>
                    <p>Observe que ele vence em 10 minutos.</p>
                </td>
            </tr>
            <tr>
                <td class='td end'>
                    <h6>Precisa de ajuda? Entre em contato conosco.</h6>
                    <br />
                    <h5>  Servicess LTDA.</h5>
                </td>
            </tr>
        </table>
    </body>
    
    </html>
`