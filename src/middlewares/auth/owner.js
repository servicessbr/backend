const { error } = require('console');
const Works = require("../../models/Works");
/*
    * Confere se o usuário é dono do anúncio( work )
    * antes de deixar alterar.
*/
const owner = async (req, res, next) => {
    const { work_id } = req.params;
    const uid = req.uid;

    if (!work_id) return res.status(401).json({ message: 'work owner no work_id' });

    const owns = await Works.findOne({
        attributes: ['user_uid'],
        where: { id: work_id }
    }).catch(err => error(err));

    if (!(owns && owns.user_uid))return res.status(401).json({ message: 'owner error - no work' });
    if (owns.user_uid !== uid) return res.status(401).json({ message: 'owner dont match error' });

    return next();
}

module.exports = owner;