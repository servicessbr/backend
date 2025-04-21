import Users from '../models/Users';
import { Op } from 'sequelize';

const chatList = async (list:Array<any>) => {

    const onlyUidList = list.map((it) => it.receiver)

    //@ts-ignore
    const newList = await Users.findAll({
        raw: true,
        attributes: ['profession', 'name', 'uid'],
        where: {
            uid: {
                [Op.in]: onlyUidList
            }
        }
    })

    const readyList = list.map((t1) => ({ ...t1, ...newList.find((t2:any) => t2.uid === t1.receiver) }));

    return readyList;
}

export default chatList;