var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetUpSells = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM up_sell where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.GetUpSellsByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;
        pool.query('SELECT * FROM up_sell where id_usuario = $1 and id=$2', [id_usuario, id], (error, results) => {
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


module.exports.SaveUpSells = (req, res, next) => {
    try {
        const { id_usuario, id_produto_selecionado_um, id_produto_selecionado_dois, nome, status, tipo_checkout, quantidade, preco, assunto_email, mensagem_sms } = req.body;
        pool.query('INSERT INTO up_sell (id_usuario, id_produto_from, id_produto_to, status, nome, tipo_checkout, quantidade, preco, assunto_email, mensagem_sms) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id_usuario, id_produto_from) DO UPDATE SET id_usuario=$1, id_produto_from=$2, id_produto_to=$3, status=$4, nome=$5, tipo_checkout=$6, quantidade=$7, preco=$8, assunto_email=$9, mensagem_sms=$10', [id_usuario, id_produto_selecionado_um, id_produto_selecionado_dois, status, nome, tipo_checkout, quantidade, preco, assunto_email, mensagem_sms], (error, results) => {
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
module.exports.DeleteUpSellByID = (req, res, next) => {
    try {
        const { id, id_usuario } = req.body;
        pool.query('DELETE FROM  up_sell WHERE id = $1 and id_usuario = $2', [id, id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send();
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetUpSellByProductID = (req, res, next) => {
    try {
        const { id_usuario, id_produto } = req.body;
        pool.query('SELECT * FROM up_sell where id_usuario = $1 and id_produto_from = $2', [id_usuario, id_produto], (error, results) => {
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