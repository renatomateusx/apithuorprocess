var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');

module.exports.GetCheckoutAtivo = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM checkouts where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}
module.exports.DoPay = (req, res, next) => {
    try {
        const { pay } = req.body;
        console.log("Pay", pay);
    } catch (error) {
        res.json(error);
        res.end();
    }
}