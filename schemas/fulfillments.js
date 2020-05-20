var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

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
        const { order_id, json_shopify_order, fulfillment_id, id_usuario, status } = req.body;
        pool.query('INSERT INTO fulfillments (order_id, json_shipments, fulfillment_id, id_usuario, status) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id_usuario, order_id, fulfillment_id) DO UPDATE SET order_id=$1, json_shipments=$2, fulfillment_id=$3, id_usuario=$4', [order_id, json_shopify_order, fulfillment_id, id_usuario, status], (error, results) => {
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