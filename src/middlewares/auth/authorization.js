
import 'dotenv/config';
const jwt = require('jsonwebtoken');
import { error } from 'console';

const Users = require("../../models/Users");

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    if (
        token === null ||
        token === undefined
    ) {
        return res.status(401).end();
    };

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return res.status(403).json({ message: 'invalide token' });
    }

    const { uid, email, refreshtoken } = jwt.decode(token);

    if (uid === null) {
        return res.status(500).json({ message: 'null uid' })
    };
    if (refreshtoken === null) {
        return res.status(500).json({ message: 'null refreshtoken' })
    };

    await Users.findOne({
        attributes: ['refreshtoken', 'blocked', 'pro'],
        where: { uid }
    })
        .then(data => {
            if (data === null) {
                return res.status(500).json({ message: 'auth user not found' })
            } else if (data.blocked) {
                return res.status(500).json({ message: 'Essa conta foi desativada por violar o art. ' + '12.6' })
            } else {
                req.uid = uid;
                req.email = email;
                req.pro = data.pro;
                return next();
            };
        })
        .catch((err) => {
            error(err)
            return res.status(500).json({ message: "token error" })
        })
}

export default authorization;