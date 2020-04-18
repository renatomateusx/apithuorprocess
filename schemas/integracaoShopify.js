var pool = require('../db/queries');
var utils = require('../resources/util');
module.exports.GetIntegracaoShopifyCheckout = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_usuario } = req.body;
            pool.query('SELECT * FROM integracao_shopify WHERE id_usuario=$1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows);

            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.AddIntegracaoShopifyCheckout = (req, res, next) => {
    try {
        const {
            status,
            auto_sincroniza,
            pula_carrinho,
            tipo_integracao,
            url_loja,
            chave_api_key,
            senha,
            segredo_compartilhado,
            quais_pedidos_enviar,
            id_usuario } = req.body;
        pool.query('INSERT INTO integracao_shopify (status, auto_sincroniza, pula_carrinho, tipo_integracao, url_loja, chave_api_key, senha, segredo_compartilhado, quais_pedidos_enviar, id_usuario) VALUES ($1, $2, $3,$4,$5,$6, $7, $8, $9, $10)',
            [status,
                auto_sincroniza,
                pula_carrinho,
                tipo_integracao,
                url_loja,
                chave_api_key,
                senha,
                segredo_compartilhado,
                quais_pedidos_enviar,
                id_usuario],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).send(`Proposta Adicionada: ${result.insertId}`)
            })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateIntegracaoShopifyCheckout = (req, res, next) => {
    try {
        const {
            id_usuario,
            id,
            status,
            auto_sincroniza,
            pula_carrinho,
            tipo_integracao,
            url_loja,
            chave_api_key,
            senha,
            segredo_compartilhado,
            quais_pedidos_enviar } = req.body;
        pool.query('UPDATE integracao_shopify SET status=$1, auto_sincroniza=$2, pula_carrinho=$3, tipo_integracao=$4, url_loja=$5, chave_api_key=$6, senha=$7, segredo_compartilhado=$8, quais_pedidos_enviar=$9) WHERE id=$10 and id_usuario = $11',
            [status,
                auto_sincroniza,
                pula_carrinho,
                tipo_integracao,
                url_loja,
                chave_api_key,
                senha,
                segredo_compartilhado,
                quais_pedidos_enviar,
                id,
                id_usuario],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).send(`Proposta Adicionada: ${result.insertId}`)
            })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.ReInstalarIntegracao = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            utils.makeAPICallExternalHTTPS()
            .then(retorno =>{

            })
            .catch(error =>{
                console.log("Erro ao tentar criar a API de Produtos para o tema.");
            })
        } catch (error) {
            reject(error);
        }
    });
}
