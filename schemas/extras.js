var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetCEP = (cep) => {
    return new Promise((resolve, reject) => {
        try {
            const { cep } = req.body;
            console.log(cep);
            pool.query('SELECT * FROM usuarios where id_usuario = $1', [cep], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rowCount > 0) {
                    resolve(results.rows[0]);
                }
                else {
                    resolve(null);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}
