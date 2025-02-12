/* 
    * Models:
*/
const Cities = require('../models/Cities');

const locationsController = {
    async list(req, res) {

        const { location } = req.params;

        await Cities.findAll({
            attributes: ['name', 'id'],
            where: { state_id: location }
        })
            .then((data) => res.status(200).json(data))
            .catch((e) => {
                console.error(e);
                return res.status(500).json({ message: 'list cities error' });
            });
    }

}

module.exports = locationsController;
