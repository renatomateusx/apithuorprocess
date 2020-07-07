var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');
const moment = require('moment');


module.exports.GetFulFillmentList = () => {
    return new Promise((resolve, reject) => {
        try {
            const data = moment().format();
            pool.query("SELECT * FROM fulfillments WHERE status <> 'DELIVERED' and proxima_consulta = $1",[data], (error, results) => {
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
        const { order_id, tracking_number, fulfillment_id, id_usuario, status, data, updated, email, telefone } = req.body;
        pool.query('INSERT INTO fulfillments (order_id, tracker_number, fulfillment_id, id_usuario, status, data, last_updated, email, telefone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id_usuario, tracker_number) DO UPDATE SET order_id=$1, tracker_number=$2, fulfillment_id=$3, id_usuario=$4, status=$5, data=$6, last_updated=$7, email=$8, telefone=$9', [order_id, tracking_number, fulfillment_id, id_usuario, status, data, updated, email, telefone], (error, results) => {
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

module.exports.InsertFulFillment = (req, res, next) => {
    try {
        const { nome_comprador, email_comprador, telefone_comprador, cpf_comprador, numero_pedido, codigo_rastreio, id_usuario } = req.body;
        const data = moment().format();
        const status = "PENDING";
        pool.query('INSERT INTO fulfillments (nome, email, telefone, cpf, order_id, tracker_number, id_usuario, data, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id_usuario, tracker_number) DO UPDATE SET nome=$1, email=$2, telefone=$3, cpf=$4, order_id=$5, tracker_number=$6,  id_usuario=$7, data=$8, status=$9', [nome_comprador, email_comprador, telefone_comprador, cpf_comprador, numero_pedido, codigo_rastreio, id_usuario, data, status], (error, results) => {
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
module.exports.UpdateFulFillmentStatusInterno = (req, res, next) => {
    try {
        const { status_interno, id_usuario, order_id } = req.body;
        const data = moment().format();
        pool.query('UPDATE fulfillments set status_interno = $1, data=$4 WHERE id_usuario = $2 and order_id = $3', [status_interno, id_usuario, order_id, data], (error, results) => {
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

module.exports.UpdateStatusFulFillmentInternal = (id_usuario, id, status, updated, statusText) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('UPDATE fulfillments SET status =$3, last_updated=$4, status_text = $5 where id_usuario = $1 and id = $2', [id_usuario, id, status, updated, statusText], (error, results) => {
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

module.exports.UpdateStatusFulFillmentInternalProximaConsulta = (id_usuario, id, data) => {
    return new Promise((resolve, reject) => {
        try {
            const dataUpdated = moment().format();
            pool.query('UPDATE fulfillments SET proxima_consulta =$3, last_updated = $4 where id_usuario = $1 and id = $2', [id_usuario, id, data, dataUpdated], (error, results) => {
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