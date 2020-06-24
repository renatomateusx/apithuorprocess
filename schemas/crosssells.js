var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');
const produtos = require('./produtos');
module.exports.GetCrossSells = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM cross_sell where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.GetCrossSellsByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;
        pool.query('SELECT * FROM cross_sell where id_usuario = $1 and id=$2', [id_usuario, id], (error, results) => {
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


module.exports.SaveCrossSells = (req, res, next) => {
    try {
        const { id_usuario, id_produto_selecionado_um, id_produto_selecionado_dois, nome, status, quando_oferecer, quantidade, preco, assunto_email, mensagem_sms } = req.body;
        console.log(req.body);
        pool.query('INSERT INTO cross_sell (id_usuario, id_produto_from, id_produto_to, status, nome, quando_oferecer, quantidade, preco, assunto_email, mensagem_sms) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id_usuario, id_produto_from, quando_oferecer) DO UPDATE SET id_usuario=$1, id_produto_from=$2, id_produto_to=$3, status=$4, nome=$5, quando_oferecer=$6, quantidade=$7, preco=$8, assunto_email=$9, mensagem_sms=$10', [id_usuario, id_produto_selecionado_um, id_produto_selecionado_dois, status, nome, quando_oferecer, quantidade, preco, assunto_email, mensagem_sms], (error, results) => {
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
module.exports.DeleteCrossSellByID = (req, res, next) => {
    try {
        const { id, id_usuario } = req.body;
        pool.query('DELETE FROM  cross_sell WHERE id = $1 and id_usuario = $2', [id, id_usuario], (error, results) => {
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

module.exports.GetCrossSellByProductID = (req, res, next) => {
    try {
        const { id_usuario, id_produto } = req.body;
        pool.query('SELECT * FROM cross_sell where id_usuario = $1 and id_produto_from = $2', [id_usuario, id_produto], (error, results) => {
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

module.exports.GetCrossSellByStorePageOrCartPage = async (req, res, next) => {
    try {
        const { id_usuario, id_produto } = req.body;
        const LP = await produtos.GetProdutoByVariantIDInternal(id_produto);
        var id_p = id_produto;
        if(LP){
            id_p = LP.id_produto_json;
        }
        pool.query('SELECT * FROM cross_sell cs JOIN produtos p on p.id_thuor = cs.id_produto_from where cs.id_usuario = $1 and p.id_produto_json = $2', [id_usuario, id_p], (error, results) => {
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