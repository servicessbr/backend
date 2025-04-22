"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (operation_number, user_uid, date_approved, transaction_amount, user_name) => `
    <!DOCTYPE html>
    <html lang="pt-br">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agradecemos pela sua compra</title>
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
                margin: -10px 0 0px 0;
            }
    
            .title {
                overflow: hidden;
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
                padding: 20px 20px 0 0;
            }
    
            .title span {
                font-weight: 100;
                font-size: 17px;
            }
    
            .title h2,
            .title span {
                margin: 0;
                color: white;
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
    
            button {
                background-color: #00AE74;
                border-style: none;
                border-radius: 100px;
                padding: 20px 60px;
                color: #fff;
                font-weight: bold;
                margin-top: 30px;
            }
    
            .absolute {
                position: absolute;
                width: 600px;
                bottom: 0;
                left: 0;
                width: 100%;
                margin-left: 0;
            }
    
            .color {
                background-color: rgba(0, 174, 116, 0.6);
            }
    
            .black_ribbon {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 18px 20px;
                color: white;
                margin-top: 0px;
            }
    
            .white_ribbon {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 20px;
                color: #222D36;
                font-size: 20px;
            }
    
            .two1 {
                min-height: 200px;
                display: flex;
                border-top: 1px solid #DEE6EB;
    
            }
    
            .two2 {
                width: 50%;
                height: 100%;
    
                text-align: center;
    
                color: #222D36;
                font-size: 22px;
            }
    
            .two2 {
                padding: 0 10px;
            }
    
            .two3 {
                color: #222D36;
    
    
                width: 50%;
                height: 100%;
                background-color: #DEE6EB;
    
    
                display: flex;
    
                justify-content: center;
            }
    
            .two3 ul {
                list-style: none;
            }
    
            #no-margin {
                margin: 0;
                padding: 0;
            }
    
            :root {
                color-scheme: only light;
            }
    
            .margin-topp {
                height: 68px;
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
                <td align="center" style="padding: 80px 0 0 0;">
                    <h3 style="text-transform: uppercase;">
                        Sua transação foi realizada. Obrigado!
                    </h3>
                </td>
            </tr>
            <tr>
                <td class='td' align="center">
                    <p>
                        Veja a seguir uma cópia dos detalhes da sua transação. Mantenha em um lugar seguro para consulta
                        futura.
                    </p>
                </td>
            </tr>
            <tr style="position: relative;" style="padding: 0;margin:0;" id="no-margin">
                <td class="two1">
                    <div class="two2">
                        <div class="margin-topp"></div>
                        <strong>Número de operação: ${operation_number}</strong>
                    </div>
                    <div class="two3">
                        <ul>
                            <li>
                                <p><strong>Nome: ${user_name}</strong></p>
                            </li>
                            <li>
                                <p><strong>ID público: </strong>${user_uid}</p>
                            </li>
                            <li>
                                <p><strong>Data da compra: </strong>${date_approved}</p>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
            <tr style="position: relative;" style="padding: 0;margin:0;" id="no-margin">
                <td bgcolor="#222D36" class="black_ribbon">
                    <div>
                        <strong>
                            Preço
                        </strong>
                    </div>
                </td>
            </tr>
            <tr style="position: relative;">
                <td class="white_ribbon">
                    <strong>
                        Total:
                        <br /><br />
                        R$ ${transaction_amount}
                        <br /><br />
                        Forma de pagamento: PIX
                    </strong>
                </td>
            </tr>
            <tr>
                <td class='td end'>
                    <h6>Não reconhece essa ação? Entre em contato conosco que resolveremos.</h6>
                    <br />
                    <h5>Servicess LTDA.</h5>
                </td>
            </tr>
        </table>
    </body>
    
    </html>
`;
