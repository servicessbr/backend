import 'dotenv/config';
import jwt from 'jsonwebtoken';

function generateToken (uid:any, email:any, refreshtoken:any) {

    return jwt.sign(
        { uid, email, refreshtoken },
        process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '360d' }
    );
}

export default generateToken;