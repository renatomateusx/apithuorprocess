var pool = require('../db/queries');

module.exports.GetTransacoes = (req, res, next) => {
    try {
        const { shop, id_usuario } = req.body;
        console.log(shop, id_usuario);
        pool.query('SELECT * FROM transacoes where url_loja = $1 and id_usuario =$2', [shop, id_usuario], (error, results) => {
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

module.exports.GetTransacoesByID = (req, res, next) => {
    try {
        const { shop, id_usuario, id } = req.body;
        pool.query('SELECT * FROM transacoes where url_loja = $1 and id_usuario =$2 and id=$3', [shop, id_usuario, id], (error, results) => {
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


async function insereTransacao(id_usuario, url_loja, JSON_FrontEndUserData, JSON_BackEndPayment, JSON_GW_Response, JSON_ShopifyOrder, JSON_ShopifyResponse, status) {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query('INSERT INTO transacoes (id_usuario, url_loja, json_front_end_user_data, json_back_end_payment, json_gw_response, json_shopify_order, json_shopify_response, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id_usuario, url_loja, JSON_FrontEndUserData, JSON_BackEndPayment, JSON_GW_Response, JSON_ShopifyOrder, JSON_ShopifyResponse, status], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.insertId);
            })

        } catch (error) {
            reject(error);

        }
    });
}