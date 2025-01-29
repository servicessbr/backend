module.exports = (type, client_name, payment_amount, location, hour, day, week, month) =>
    `
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
                padding: 20px 0px;
                width: 100%;
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

            .white_ribbon2 { 
                 justify-content: space-around;
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
                height: 200px;
                background-color: #DEE6EB;

    
    
                display: flex;
    
                justify-content: center;
            }

            .two3 strong{

                font-size: 60px;
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

            .text_center {
                text-align: center;
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
                        ${type === 'prof'
        ? client_name + ' ' + 'aceitou o orçamento!'
        : 'Serviço agendado com sucesso!'
    } 
                    </h3>
                </td>
            </tr>
            <tr>
                <td class='td' align="center">
                    <p>
                         Entre em contato diretamente com o ${type === 'prof' ? 'cliente' : 'profissional'} para alinhar as condições do serviço, como data, horário e local do atendimento.
                    ${type === 'prof' && '<br/><br/>Realize o serviço conforme o combinado para que o pagamento seja efetuado na data marcada.'}
                    </p>
                </td>
            </tr>
            <tr style="position: relative;" style="padding: 0;margin:0;" id="no-margin">
                <td class="two1">
                    <div class="two2 center text_center">
                        <div class="margin-topp"></div>
                        <strong>${week}, <i>${hour}</i></strong>
                    </div>
                    <div class="two3 center">
                        <div class="center text_center">
                            <strong>${day}</strong>
                            <p class="no-margin">${month}</p>
                        </div>
                    </div>
                </td>
            </tr>
            <tr style="position: relative;" style="padding: 0;margin:0;" id="no-margin">
                <td bgcolor="#222D36" class="black_ribbon center">
                    <div class="center">
                        <strong>
                            ${type === 'prof' ? client_name + ' ' + ' realizou o pagamento' : 'Pagamento realizado'}
                        </strong>
                    </div>
                </td>
            </tr>
            <tr style="position: relative;">
                <td class="white_ribbon white_ribbon2">
                    <strong>
                        Valor pago:
                        <br /><br />
                        R$ ${payment_amount}                    
                    </strong>

                    <strong>
                        Local do atendimento:
                        <br /><br />
                        ${location}                    
                    </strong>
                </td>
            </tr>
                  <tr>
                <tr>
                <td class='td'>
                    <a href="https://www.servicess.com.br/service_orders/${type === 'prof' ? 'list' : 'budgets'}">
                        <button>
                            Ver agendamentos
                        </button>
                    </a>
                    <br /><br /><br /><br />
                </td>
            </tr>
            </tr>
            <tr>
                <td class='td end'>
                    <h6>Precisa de ajuda? Entre em contato conosco.</h6>
                    <br />
                    <h5>© 2024 Servicess LTDA.</h5>
                </td>
            </tr>
        </table>
    </body>
    
    </html>
`