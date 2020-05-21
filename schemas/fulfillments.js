var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');



module.exports.GetFulFillmentList = () => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM fulfillments', (error, results) => {
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

module.exports.GetFulFillment = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM fulfillments where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.SaveFulFillment = (req, res, next) => {
    try {
        const { order_id, json_shopify_order, fulfillment_id, id_usuario, status, data, updated, email, telefone } = req.body;
        pool.query('INSERT INTO fulfillments (order_id, json_shipments, fulfillment_id, id_usuario, status, data, last_updated, email, telefone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id_usuario, order_id, fulfillment_id) DO UPDATE SET order_id=$1, json_shipments=$2, fulfillment_id=$3, id_usuario=$4, status=$5, data=$6, last_updated=$7, email=$8, telefone=$9', [order_id, json_shopify_order, fulfillment_id, id_usuario, status, data, updated, email, telefone], (error, results) => {
            if (error) {
                throw error
            }
            // res.status(200).send(results.rows);
            // res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetFulFillmentByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;
        pool.query('SELECT * FROM fulfillments where id_usuario = $1 and id = $2', [id_usuario, id], (error, results) => {
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

module.exports.UpdateStatusFulFillmentByID = (req, res, next) => {
    try {
        const { id_usuario, id, status } = req.body;
        pool.query('UPDATE fulfillments SET status =$3 where id_usuario = $1 and id = $2', [id_usuario, id, status], (error, results) => {
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

module.exports.UpdateStatusFulFillmentInternal = (id_usuario, id, status, updated) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('UPDATE fulfillments SET status =$3, last_updated=$4 where id_usuario = $1 and id = $2', [id_usuario, id, status, updated], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(1);
            })
        } catch (error) {
            reject(error);
        }
    })
}