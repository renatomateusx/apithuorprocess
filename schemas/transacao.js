var pool = require('../db/queries');
const mercadopago = require("mercadopago");
var integracaoShopify = require('./integracaoPlataformas');
var checkoutsSchema = require('./checkouts');
const utilis = require('../resources/util');
const format = require('string-format');
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

async function updateTransacao(id_usuario, url_loja, JSON_CancelReembolsaResponse, status) {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query('INSERT INTO transacoes (id_usuario, url_loja, json_gw_cancel_reembolso_response, status) VALUES ($1, $2, $3, $4)', [id_usuario, url_loja, JSON_CancelReembolsaResponse, status], (error, results) => {
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

async function getItemsRefound(items) {
    return new Promise(async (resolve, reject) => {
        try {
            var ItemsRefound = [];
            items.forEach((obj, i) => {
                var LItem =
                {
                    "line_item_id": obj.variant_id,
                    "quantity": obj.quantity,
                    "restock_type": "return",
                    "location_id": 487838322
                }
                ItemsRefound.push(LItem);
            });
            resolve(ItemsRefound);

        } catch (error) {
            reject(error);
        }
    });
}

module.exports.ReembolsarPedidoByID = (req, res, next) => {
    try {
        const { shop, id_usuario, id } = req.body;
        pool.query('SELECT * FROM transacoes where url_loja = $1 and id_usuario =$2 and id=$3', [shop, id_usuario, id], async (error, results) => {
            if (error) {
                throw error
            }
            const LRetornoPedido = results.rows[0];
            const LDadosLoja = await integracaoShopify.GetDadosLojaInternal(shop);
            const LDadosGateway = await checkoutsSchema.GetCheckoutAtivoInternal(req, res, next);
            if (LDadosGateway.token_acesso != undefined && LDadosGateway.gateway == 1) {
                mercadopago.configurations.setAccessToken(LDadosGateway.token_acesso);
                const LResponseGW = JSON.parse(LRetornoPedido.json_gw_response);
                const LResponseMKTPlace = JSON.parse(LRetornoPedido.json_shopify_response);
                const ItemsRefound = await getItemsRefound(LResponseMKTPlace.order.line_items);

                mercadopago.payment.refund(LResponseGW.id)
                    .then(async function (data) {
                        var LRefoundShopify = {
                            "refund": {
                                "currency": "BRL",
                                "notify": true,
                                "note": "Cancelada pelo Vendedor",
                                "shipping": {
                                    "full_refund": true
                                },
                                "refund_line_items": ItemsRefound,
                                "transactions": [
                                    {
                                        "amount": LResponseGW.transaction_details.total_paid_amount,
                                        "kind": "refund",
                                        "gateway": "MP"
                                    }
                                ]
                            }
                        }
                        const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.REFOUND_ORDER);
                        const urlShopify = format("https://{}:{}@{}", LDadosLoja.chave_api_key, LDadosLoja.senha, LDadosLoja.url_loja);
                        var headerAditional = "X-Shopify-Access-Token";
                        var valueHeaderAditional = LDadosLoja.senha;
                        utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                            .then(async retornoShopify => {
                                const RetornoShopifyJSON = retornoShopify.body;
                                transacoes.updateTransacao(id_usuario, LDadosLoja.url_loja, data.response, 'reembolsada')
                                    .then((retornoInsereTransacao) => {
                                        const response = {
                                            dataGateway: data.response,
                                            dataStore: RetornoShopifyJSON
                                        }
                                        res.status(200).send(response);
                                    })
                                    .catch((error) => {
                                        console.log("Erro ao inserir transação no banco", error);
                                    })
                            })
                            .catch(error => {
                                console.log("Erro ao enviar informação do checkout para a shopify", error);
                            })

                        //const LUpdateTransacao = await this.updateTransacao(id_usuario, LDadosLoja.url_loja, data.response, 'REEMBOLSADA');

                    })
                    .catch(error => {
                        console.log("Erro ao efetuar o Refound", error);
                    })
            }
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

