var pool = require('../db/queries');

module.exports.GetFretes = (req, res, next) => {
    try {
        const { shop } = req.body;
        pool.query('SELECT * FROM transportadoras where url_loja = $1', [shop], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}