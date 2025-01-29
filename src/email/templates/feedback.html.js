module.exports = (
    code,
    suggestion,
    uid,
    name,
    email,
    phone
) =>
    `
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Central de antendimento</title>
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
            border-radius: 0 0 8px 8px;
        }

        h3 {
            color: #222D36;
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

        .align-left {
            text-align: start;
        }

        button {
            background-color: #00ae74;
            border-style: none;
            border-radius: 100px;
            padding: 20px 60px;
            color: #fff;
            font-weight: bold;
            margin-top: 30px;
        }

        .btn2 {
            background-color: #222d36 !important;
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
                <h3>${code}</h3>
            </td>
        </tr>
        <tr>
            <td class='td align-left'>
                <p><strong>uid: </strong>${uid}</p>
                <p><strong>nome: </strong>${name}</p>
                <p><strong>email: </strong>${email}</p>
                <p><strong>phone: </strong>${phone}</p>
                <p>
                    ${suggestion}
                </p>
            </td>
        </tr>
        <tr>
            <td class='td'>
                <a href="https://wa.me/${phone}?text=Olá!" target="_blank">Abrir no APP 📱</a>
            </td>
        </tr>
        <tr>
            <td class='td'>
                <a href="https://web.whatsapp.com/send?phone=${phone}&text=Olá!" target="_blank"><button>Abrir no WhatsApp WEB</button></a>
            </td>
        </tr>

        <tr>
            <td class='td end'>
                <h6>Central de atendimento</h6>
                <br />
                <h5>© 2024 Servicess LTDA.</h5>
            </td>
        </tr>
    </table>
</body>

</html>
`