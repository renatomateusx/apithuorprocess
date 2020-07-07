var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetCEP = (cep) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query("select logradouro, bairro, cidade as localidade, lg.estado as uf, '' as complemento from tbl_cep_202005_n_log lg left join tbl_cep_202005_n_log_complemento on tbl_cep_202005_n_log_complemento.cep = lg.cep join tbl_cep_202005_n_cidade on tbl_cep_202005_n_cidade.id_cidade = lg.cidade_id join tbl_cep_202005_n_bairro on tbl_cep_202005_n_bairro.id_bairro = lg.bairro_id where lg.cep = $1", [cep], (error, results) => {
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
