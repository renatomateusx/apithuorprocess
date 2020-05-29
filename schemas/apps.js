var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const produtos = require('./produtos');
var moment = require("moment");

module.exports.GetApps = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM apps', (error, results) => {
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

module.exports.GetStatusApp = (req, res, next) => {
    try {
        const { id_usuario, app } = req.body;
        pool.query('SELECT * FROM apps_integracao where id_usuario = $1 and app = $2',[id_usuario, app], (error, results) => {
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

module.exports.SaveApp = async (req, res, next) => {
    try {
        const { url_loja, id_usuario, status, app } = req.body;
        const LData = moment().format();
        pool.query('INSERT INTO apps_integracao (url_loja, id_usuario,status, data, app) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (app, id_usuario) DO UPDATE SET url_loja = $1, id_usuario=$2, status=$3, data=$4, app=$5', [url_loja, id_usuario, status, LData, app], (error, results) => {
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
module.exports.GetAppByID = (req, res, next) => {
    try {
        const { id_produto, url_loja } = req.body;
        pool.query('SELECT * FROM reviews WHERE id_produto = $1 and url_loja = $2', [id_produto, url_loja], (error, results) => {
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