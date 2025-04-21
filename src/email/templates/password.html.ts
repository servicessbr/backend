export default (token:any) =>
`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar uma nova senha</title>
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
        }

        .title {

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
            color: #00AE74;
        }

        .title {
            overflow: hidden;
            display: flex;
            align-items: center;
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
            font-size: 2em;
            padding: 50px 0;
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
            padding: 20px 40px;
            color: #fff;
            font-weight: bold;
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
            <td class='td'>
                <p> </p>
            </td>
        </tr>
        <tr>
            <td class='td'>
                <span>Esqueceu a sua senha?</span>
            </td>
        </tr>
        <tr>
            <td class='td'>
                <p>Não tem problema! Clique no botão abaixo para criar uma nova:</p>
            </td>
        </tr>
        <tr>
            <td class='td'>
                <a href="http://www.servicess.com.br/reset/password/${token}"><button>Criar nova senha</button></a>
                <br /><br/>  <br /><br/>
            </td>
            
        </tr>
        <tr>
            <td class='td end'>
                <h6>
                    Caso não tenha solicitado a alteração da senha, por favor, desconsidere esta mensagem e sua senha
                    atual será mantida.
                </h6>
                <br />
                <h5>  Servicess LTDA.</h5>
            </td>
        </tr>
    </table>
</body>

</html>
`