const Users = require('../models/Users');
const { Op } = require('sequelize');

const chatList = async (list) => {

    const onlyUidList = list.map((it) => it.receiver)

    const newList = await Users.findAll({
        raw: true,
        attributes: ['profession', 'name', 'uid'],
        where: {
            uid: {
                [Op.in]: onlyUidList
            }
        }
    })

    const readyList = list.map((t1) => ({ ...t1, ...newList.find((t2) => t2.uid === t1.receiver) }));

    return readyList;
}

export default chatList;