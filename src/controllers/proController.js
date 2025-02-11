const proController = {
    isPro(req, res) {
        const pro = req.pro;

        return res.status(200).json({ isPro: pro }).end();
    }
}

module.exports = proController;