var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetMensagens = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM mensagens where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.SaveMensagem = (req, res, next) => {
    try {
        const { nome, tipo_mensagem, titulo, mensagem, status,data, id_usuario } = req.body;
        pool.query('INSERT INTO mensagens (nome, tipo_mensagem, titulo, mensagem, status, data, id_usuario) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id_usuario, nome) DO UPDATE SET nome=$1, tipo_mensagem=$2, titulo=$3, mensagem=$4, status=$5, data=$6, id_usuario=$7', [nome, tipo_mensagem, titulo, mensagem, status, data, id_usuario], (error, results) => {
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
module.exports.DeleteMensagensByID = (req, res, next) => {
    try {
        const { id, id_usuario } = req.body;
        pool.query('DELETE FROM  mensagens WHERE id = $1 and id_usuario = $2', [id, id_usuario], (error, results) => {
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

module.exports.GetMensagemByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;
        pool.query('SELECT * FROM mensagens where id_usuario = $1 and id = $2', [id_usuario, id], (error, results) => {
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