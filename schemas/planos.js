var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetPlanos = (req, res, next) => {
    try {
        pool.query('SELECT * FROM planos', (error, results) => {
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

module.exports.GetPlanosByID = (req, res, next) => {
    try {
        const {id} = req.body;
        pool.query('SELECT * FROM planos WHERE id = $1', [id], (error, results) => {
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

module.exports.GetPlanosInternal = () => {
    return new Promise((resolve, reject) => {

        try {
            pool.query('SELECT * FROM planos', (error, results) => {
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
module.exports.GetUserByIDInternalByID = (id) => {
    return new Promise((resolve, reject) => {

        try {
            pool.query('SELECT * FROM planos WHERE id = $1', [id], (error, results) => {
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

