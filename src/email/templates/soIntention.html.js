module.exports = (
    prof_name, client_name,
    d_date, d_hours, d_location,
    description
) =>
    `
 <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tem mensagem para você</title>
        <style>
            :root {
                color-scheme: only light;
            }
    
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
                margin-top: 40px;
                border-radius: 0 0 8px 8px;
            }
    
            h3 {
                color: #222D36;
                text-align: center;
                width: 80%;
                font-size: 22px;
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
                font-family: "Montserrat", sans-serif;
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
                color: #222D36;
                font-size: 1.2em;
    
            }
    
            .td span {
                color: #222D36;
                font-size: 2.4em;
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
    
            .li {
                background-color: #fff;
            }
    
            .li strong {
                height: fit-content;
                width: fit-content;
                margin: 0 10px 0 60px;
            }
    
            .li p {
                height: fit-content;
                width: fit-content;
                margin: 10px 0;
            }
    
            .margin {
                height: 40px;
            }
    
    
            /*
            .button {
                border-style: none;
                background-color: #00f3a2;
                padding: 16px 68px;
                color: white;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, .3);
                font-weight: bold;
                font-size: 16px;
                border-radius: 12px;
                box-shadow: 0 8px 12px -8px #00f3a2;
                text-decoration: none;
            }
    
            .button:link {
                text-decoration: none;
                color: white;
    
            }
    
            .button:visited {
                text-decoration: none;
                color: white;
    
            }
            */
    
            button {
                background-color: #00AE74;
                border-style: none;
                border-radius: 100px;
                padding: 20px 60px;
                color: #fff;
                font-weight: bold;
                margin-top: 30px;
            }
    
            .space {
                padding-top: 40px;
            }
    
            .line_break {
                line-break: normal;
            }
    
            .text_align {
                text-align: center;
            }
            .txt_grey {
                color: #696969;
            }
            #x_t {
                margin: 10px 10px 10px 70px;
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
                    <h3>Olá ${prof_name}, você tem uma nova ordem de serviço!</h3>
                </td>
            </tr>
            <tr class="txt_grey">
                <td align="center" style="padding: 20px 100px 0 100px;">
                    <h4>${client_name} tem interesse em contratar seus serviços.</h4> 
                    <h4>Para dar continuidade, solicitamos que elebore um orçamento com o valor do serviço.</h4>
                </td>
            </tr>
            <tr class="margin"></tr>
            <tr class="li">
                <td>
                    <strong>Data e horário:</strong>
                    <p id="x_t">${d_date}</p>
                    <i id="x_t">${d_hours}</i>   
                </td>
            </tr>
                  <tr class="margin"></tr>
            <tr class="li">
                <td>
                    <strong>Local e endereço:</strong>
                    <p id="x_t">${d_location}</p>
                </td>
            </tr>
                  <tr class="margin"></tr>
             <tr class="li">
                <td>
                    <strong>Descrição do serviço:</strong>
                    <p id="x_t">
                        ${description}
                    </p> 
                </td>
            </tr>
            <tr>
                <tr>
                <td class='td'>
                    <a href="https://www.servicess.com.br/service_orders/list"><button>Fazer orçamento</button></a>
                    <br /><br /><br /><br />
                </td>
            </tr>
            </tr>
            <tr style="margin-top: 40px;">
                <td class="td end">
                    <h6>
                        Precisa de ajuda? Entre em contato conosco.
                    </h6>
                    <br />
                    <h5>© 2024 Servicess LTDA.</h5>
                </td>
            </tr>
        </table>
    </body>
    
    </html>
`