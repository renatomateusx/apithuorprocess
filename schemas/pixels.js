var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetPixels = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM pixels where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.SavePixels = (req, res, next) => {
    try {
        const { id_usuario, nome_pixel, facebook_id_pixel, marca_boleto, google_id_conversao, google_rotulo_conversao, status, array_produtos_id, tipo, google_analytics_id } = req.body;
        pool.query('INSERT INTO pixels (id_usuario, nome_pixel, facebook_id_pixel, marca_boleto, google_id_conversao, google_rotulo_conversao, status, array_produtos_id, tipo, google_analytics_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10) ON CONFLICT (id_usuario, nome_pixel) DO UPDATE SET id_usuario=$1, nome_pixel=$2, facebook_id_pixel=$3, marca_boleto=$4, google_id_conversao=$5, google_rotulo_conversao=$6, status=$7, array_produtos_id=$8, tipo=$9, google_analytics_id=$10', [id_usuario, nome_pixel, facebook_id_pixel, parseInt(marca_boleto), google_id_conversao, google_rotulo_conversao, parseInt(status), array_produtos_id, parseInt(tipo), google_analytics_id], (error, results) => {
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
module.exports.DeletePixelByID = (req, res, next) => {
    try {
        const { id, id_usuario } = req.body;
        pool.query('DELETE FROM pixels WHERE id = $1 and id_usuario = $2', [id, id_usuario], (error, results) => {
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

module.exports.GetPixelByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;
        pool.query('SELECT * FROM pixels where id_usuario = $1 and id = $2', [id_usuario, id], (error, results) => {
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