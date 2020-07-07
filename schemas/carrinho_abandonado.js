var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetCarrinho = (req, res, next) => {
    try {
        pool.query('SELECT * FROM carrinho_abandonado order by id_cart asc', (error, results) => {
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

module.exports.GetCarrinhoByID = (req, res, next) => {
    try {
        const {id} = req.body;
        pool.query('SELECT * FROM carrinho_abandonado WHERE id_cart = $1', [id], (error, results) => {
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

module.exports.GetCarrinhoInternal = () => {
    return new Promise((resolve, reject) => {

        try {
            pool.query('SELECT * FROM carrinho_abandonado', (error, results) => {
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
module.exports.GetCarrinhoByIDInternalByID = (id) => {
    return new Promise((resolve, reject) => {

        try {
            pool.query('SELECT * FROM carrinho_abandonado WHERE id_cart = $1', [id], (error, results) => {
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
module.exports.SaveCarrinho = (req, res, next) => {
    return new Promise((resolve, reject) => {

        try {
            const {valor_produto, nome_cliente, email_cliente, token_push_cliente, produtos, produtos_skus, link_compra, criado_em, modificado_em, status, ip, id_usuario} = req.body;
            pool.query('INSERT INTO carrinho_abandonado (valor_produto, nome_cliente, email_cliente, token_push_cliente, produtos, produtos_skus, link_compra, criado_em, modificado_em, status, ip, id_usuario) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *', [valor_produto, nome_cliente, email_cliente, token_push_cliente, produtos, produtos_skus, link_compra, criado_em, modificado_em, status, ip, id_usuario], (error, results) => {
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
