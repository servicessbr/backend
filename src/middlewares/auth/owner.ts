import { error } from 'console';
import Works from "../../models/Works";
import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
/*
    * Confere se o usuário é dono do anúncio( work )
    * antes de deixar alterar.
    * É importante porque no próximo passa o work e os subworks 
    * podem ser alterados separadamente ou paralelamente 
    * isso dificulta a validação da autorização.
*/
const
    owner = async (req: Request, res: Response, next: NextFunction) => {
        const { work_id }: any = req.body;
        //@ts-ignore
        const uid = req.uid;

        if (!(work_id && uid)) return res
            .status(401)
            .json({ message: 'work owner no no data' })
            .end();

        //@ts-ignore
        const owns = await Works.findOne({
            attributes: ['id'],
            where: {
                [Op.and]: [{ id: work_id }, { user_uid: uid }]
            }
        }).catch((err: Error) => error(err));

        /* 
            * Se encontrar um work está autorizado pois o uid do jwt
            * corresponder com o dono do work que será alterado
            * poe causa da query "where id and uid".
        */
        if (!owns) return res
            .status(401)
            .json({ message: 'owner dont match error' })
            .end();

        return next();
    }

export default owner;