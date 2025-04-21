import removeNotDigitsFromString from "../functions/onlyDigits/removeNotDigitsFromString";
import regexEP from "../functions/regexEP";
import Users from "../models/Users";
import { error } from 'console';
import { Request, Response, NextFunction } from 'express';

async function updatePhone(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    const uid = req.uid;
    const { phone }: any = req.body;

    if (!(phone && uid)) return next();

    const phoneNumber = removeNotDigitsFromString(phone);

    //@ts-ignore
    if (regexEP.phone.test(phoneNumber)) await Users.update(
        { phone: phoneNumber },
        { where: { uid } }
    )
        .then(() => res.set('X-updated-phone', 'true'))
        .catch((err: Error) => error(err));
    /*
        * Informa o client que o phone foi alterado.
    */


    return next();
}

export default updatePhone;