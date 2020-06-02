var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.GetCupons = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM cupons where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
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

module.exports.UpdateNumeroUtilizacao = (req, res, next) => {
    try {
        const { id_usuario, numero_utilizacao, id } = req.body;
        console.log(req.body);
        pool.query('UPDATE cupons SET numero_utilizacao = $2 where id=$3 and id_usuario = $1', [id_usuario, numero_utilizacao, id], (error, results) => {
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

module.exports.GetCupomByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;
        pool.query('SELECT * FROM cupons where id_usuario = $1 and id=$2', [id_usuario, id], (error, results) => {
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


module.exports.SaveCupom = (req, res, next) => {
    try {
        const { id_usuario, code, status, descricao, total_disponivel, valor_minimo_compra, data_inicio, data_fim, exige_quantidade_minima, quantidade_minima, tipo_desconto, valor_desconto, aplicar_regra_automatica_carrinho, permite_acumular, uso_unico, envia_automaticamente_carrinho_abandonado, cupom_primeira_compra, aplicar_regra_produtos_especificos, aplicar_regra_colecao, aplicar_regra_marca, aplicar_regra_categoria, aplicar_regra_forma_pagamento, exceptuar_regra_produtos_especificos, exceptuar_regra_colecao, exceptuar_regra_marca, exceptuar_regra_categoria, exceptuar_regra_forma_pagamento, frete_gratis } = req.body;
        console.log(req.body);
        pool.query('INSERT INTO cupons (id_usuario, code, status, descricao, total_disponivel, valor_minimo_compra, data_inicio, data_fim, exige_quantidade_minima, quantidade_minima, tipo_desconto, valor_desconto, aplicar_regra_automatica_carrinho, permite_acumular, uso_unico, envia_automaticamente_carrinho_abandonado, cupom_primeira_compra, aplicar_regra_produtos_especificos, aplicar_regra_colecao, aplicar_regra_marca, aplicar_regra_categoria, aplicar_regra_forma_pagamento, exceptuar_regra_produtos_especificos, exceptuar_regra_colecao, exceptuar_regra_marca, exceptuar_regra_categoria, exceptuar_regra_forma_pagamento, frete_gratis) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) ON CONFLICT(id_usuario, code) DO UPDATE SET id_usuario=$1, code=$2, status=$3, descricao=$4, total_disponivel=$5, valor_minimo_compra=$6, data_inicio=$7, data_fim=$8, exige_quantidade_minima=$9, quantidade_minima=$10, tipo_desconto=$11, valor_desconto=$12, aplicar_regra_automatica_carrinho=$13, permite_acumular=$14, uso_unico=$15, envia_automaticamente_carrinho_abandonado=$16, cupom_primeira_compra=$17, aplicar_regra_produtos_especificos=$18, aplicar_regra_colecao=$19, aplicar_regra_marca=$20, aplicar_regra_categoria=$21, aplicar_regra_forma_pagamento=$22, exceptuar_regra_produtos_especificos=$23, exceptuar_regra_colecao=$24, exceptuar_regra_marca=$25, exceptuar_regra_categoria=$26, exceptuar_regra_forma_pagamento=$27, frete_gratis=$28', [id_usuario, code, +status, descricao, total_disponivel, valor_minimo_compra, data_inicio, data_fim, exige_quantidade_minima, quantidade_minima, tipo_desconto, valor_desconto, +aplicar_regra_automatica_carrinho, +permite_acumular, +uso_unico, +envia_automaticamente_carrinho_abandonado, +cupom_primeira_compra, aplicar_regra_produtos_especificos, aplicar_regra_colecao, aplicar_regra_marca, aplicar_regra_categoria, aplicar_regra_forma_pagamento, exceptuar_regra_produtos_especificos, exceptuar_regra_colecao, exceptuar_regra_marca, exceptuar_regra_categoria, exceptuar_regra_forma_pagamento, +frete_gratis], (error, results) => {
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
module.exports.DeleteCupomByID = (req, res, next) => {
    try {
        const { id, id_usuario } = req.body;
        pool.query('DELETE FROM cupons WHERE id = $1 and id_usuario = $2', [id, id_usuario], (error, results) => {
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

module.exports.GetCupomByProductID = (req, res, next) => {
    try {
        const { id_usuario, id_produto } = req.body;
        pool.query('select * FROM cupons WHERE aplicar_regra_produtos_especificos @> \'[{"id_thuor":"' + id_produto + '"}]\' and id_usuario=$1 and status = 1', [id_usuario], (error, results) => {
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

module.exports.GetCupomByCODE = (req, res, next) => {
    try {
        const { id_usuario, code } = req.body;
        console.log(req.body);
        pool.query('select * FROM cupons WHERE code = $2 and id_usuario=$1 and status = 1', [id_usuario, code], (error, results) => {
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