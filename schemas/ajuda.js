var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetAjuda = (req, res, next) => {
    try {
        pool.query('SELECT * FROM ajuda', (error, results) => {
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

module.exports.GetAjudaByID = (req, res, next) => {
    try {
        const {id} = req.body;
        pool.query('SELECT * FROM ajuda WHERE id = $1', [id], (error, results) => {
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

module.exports.SaveAjuda = (req, res, next) => {
    try {
        const { titulo, texto, tag } = req.body;
        pool.query('INSERT INTO ajuda (titulo, texto, tag) VALUES ($1,$2,$3) ON CONFLICT (titulo) DO UPDATE SET titulo=$1, texto=$2, tag=$3', [titulo, texto, tag], (error, results) => {
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
module.exports.DeleteAjudaByID = (req, res, next) => {
    try {
        const { id } = req.body;
        pool.query('DELETE FROM  ajuda WHERE id = $1', [id], (error, results) => {
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
