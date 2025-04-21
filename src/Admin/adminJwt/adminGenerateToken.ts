import 'dotenv/config';
import jwt from 'jsonwebtoken';

function adminGenerateToken(uid:string, refreshtoken:string) {

    return jwt.sign(
        { uid, refreshtoken },
         
        process.env.ACCESS_TOKEN_ADMIN_SECRET as string,
        { expiresIn: '1200s' }
    );
}

export default adminGenerateToken;