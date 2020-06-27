var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetMensalidadesPagas = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM mensalidades where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.GetMensalidadesByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;
        pool.query('SELECT * FROM mensalidades where id_usuario = $1 and id=$2', [id_usuario, id], (error, results) => {
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



module.exports.insereTransacaoInternaMensalidades = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_usuario, data, json_pagamento, json_pagamento_back_end, status } = req.body;
            pool.query('INSERT INTO mensalidades (id_usuario, data, json_pagamento, json_pagamento_back_end, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id_usuario, data) DO UPDATE SET id_usuario=$1, data=$2, json_pagamento=$3, json_pagamento_back_end=$4, status=$5', [id_usuario, data, json_pagamento, json_pagamento_back_end, status], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200)
                res.end();
            })

        } catch (error) {
            res.status(422)
            res.end();
        }
    });
}