var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const produtos = require('./produtos');
var moment = require("moment");

module.exports.GetApps = (req, res, next) => {
    try {
        pool.query('SELECT * FROM apps where status = 1 order by id asc', (error, results) => {
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
        console.log(id_usuario, app);
        pool.query('SELECT * FROM apps_integracao where id_usuario = $1 and app = $2', [id_usuario, app], (error, results) => {
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
        const { url_loja, id_usuario, status, app, propriedades } = req.body;
        const LData = moment().format();
        pool.query('INSERT INTO apps_integracao (url_loja, id_usuario,status, data, app, propriedades) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (app, id_usuario) DO UPDATE SET url_loja = $1, id_usuario=$2, status=$3, data=$4, app=$5, propriedades=$6', [url_loja, id_usuario, status, LData, app, propriedades], (error, results) => {
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

module.exports.SaveAppInternal = async (url_loja, id_usuario, status, app, propriedades) => {
    return new Promise((resolve, reject) => {
        try {
            const LData = moment().format();
            pool.query('INSERT INTO apps_integracao (url_loja, id_usuario,status, data, app, propriedades) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (app, id_usuario) DO UPDATE SET url_loja = $1, id_usuario=$2, status=$3, data=$4, app=$5, propriedades=$6', [url_loja, id_usuario, status, LData, app, propriedades], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(1);
            })
        } catch (error) {
           reject(error);
        }
    })

}

module.exports.GetAppByID = (req, res, next) => {
    try {
        const { id } = req.body;
        pool.query('SELECT * FROM apps WHERE id = $1', [id], (error, results) => {
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

module.exports.GetIntegracaoApps = (req, res, next) => {
    try {
        const { id_usuario, app } = req.body;
        console.log(id_usuario, app);
        pool.query('SELECT * FROM apps_integracao WHERE id_usuario = $1 and app = $2', [id_usuario, app], (error, results) => {
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