var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetBoletos = (req, res, next) => {
    try {
        pool.query('SELECT * FROM recupera_boleto order by id_cart asc', (error, results) => {
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

module.exports.GetBoletoRecoveryByID = (req, res, next) => {
    try {
        const {id} = req.body;
        pool.query('SELECT * FROM recupera_boleto WHERE id_cart = $1', [id], (error, results) => {
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

module.exports.GetBoletoRecoveryInternal = () => {
    return new Promise((resolve, reject) => {

        try {
            pool.query('SELECT * FROM recupera_boleto', (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows);
            })
        } catch (error) {
            reject(error);
        }
    })
}
module.exports.GetBoletoRecoveryByIDInternalByID = (id) => {
    return new Promise((resolve, reject) => {

        try {
            pool.query('SELECT * FROM recupera_boleto WHERE id_cart = $1', [id], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows[0]);
            })
        } catch (error) {
            reject(error);
        }
    })
}
module.exports.SaveBoletoRecovery = (req, res, next) => {
    return new Promise((resolve, reject) => {

        try {
            const {nome_cliente, email_cliente,  telefone_cliente, token_push_cliente, produto_nome,bar_code, url_boleto,  criado_em, modificado_em, status, campanha_enviar, ip, id_usuario, id_tr} = req.body;            
            pool.query('INSERT INTO recupera_boleto (nome_cliente, email_cliente,  telefone_cliente, token_push_cliente, produto_nome,bar_code, url_boleto,  criado_em, modificado_em, status, campanha_enviar, ip, id_usuario, id_tr) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, $14) RETURNING *', [nome_cliente, email_cliente,  telefone_cliente, token_push_cliente, produto_nome,bar_code, url_boleto,  criado_em, modificado_em, status, campanha_enviar, ip, id_usuario, id_tr], (error, results) => {
                if (error) {
                    throw error
                }
                res.json(1);
                res.end();
            })
        } catch (error) {
            res.json(error);
            res.end();
        }
    })
}

module.exports.SaveBoletoRecoveryInternal = (nome_cliente, email_cliente,  telefone_cliente, token_push_cliente, produto_nome,bar_code, url_boleto,  criado_em, modificado_em, status, campanha_enviar, ip, id_usuario, id_tr) => {
    return new Promise((resolve, reject) => {

        try {    
            pool.query('INSERT INTO recupera_boleto (nome_cliente, email_cliente,  telefone_cliente, token_push_cliente, produto_nome,bar_code, url_boleto,  criado_em, modificado_em, status, campanha_enviar, ip, id_usuario, id_tr) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *', [nome_cliente, email_cliente,  telefone_cliente, token_push_cliente, produto_nome,bar_code, url_boleto,  criado_em, modificado_em, status, campanha_enviar, ip, id_usuario, id_tr], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows[0].id_cart);
            })
        } catch (error) {
            reject(error);
        }
    })
}
module.exports.UpdateStatusBoletoRecovery = (req, res, next) => {
    return new Promise((resolve, reject) => {

        try {
            const {status, id_cart} = req.body;
            const ids = id_cart.toString();
            pool.query('UPDATE recupera_boleto SET status = $1 where id_cart in ($2)', [status, ids], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rowCount);
            })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports.UpdateStatusBoletoRecoveryByIDTRInternal = (status, id_tr) => {
    return new Promise((resolve, reject) => {

        try {
            pool.query('UPDATE recupera_boleto SET status = $1 where id_tr = $2', [status, id_tr], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rowCount);
            })
        } catch (error) {
            reject(error);
        }
    })
}
