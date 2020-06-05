var pool = require('../db/queries');
const mercadopago = require("mercadopago");
var integracaoShopify = require('./integracaoPlataformas');
var checkoutsSchema = require('./checkouts');
const utilis = require('../resources/util');
const format = require('string-format');
const fulfillments = require('../schemas/fulfillments');
const moment = require('moment');

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

module.exports.GetPagamentosEfetuadosPorSeller = (req, res, next) => {
    try {
        const { shop, id_usuario } = req.body;
        pool.query('SELECT * FROM transacoes_internas where url_loja = $1 and id_usuario =$2', [shop, id_usuario], (error, results) => {
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
module.exports.SetPaymentComissionDone = (req, res, next) => {
    try {
        const { json_cobranca_comissao, json_response_comissao, id_usuario, data_processar } = req.body;
        pool.query("UPDATE transacoes_internas SET status = 'PAID', json_cobranca_comissao= $1, json_response_comissao=$2 WHERE id_usuario = $3 and data_processar = $4", [json_cobranca_comissao, json_response_comissao, id_usuario, data_processar], (error, results) => {
            if (error) {
                throw error
            }
            res.json(200);
        })
    } catch (error) {
        res.json(error);
    }
}


module.exports.GetTransacoesInternas = (req, res, next) => {
    try {
        const LHoje = moment().format("YYYY-MM-DD");
        pool.query("SELECT  data_processar, id_usuario, plano_usuario, url_loja, status, gateway, SUM (CAST(valor_comissao AS DOUBLE PRECISION)) as comissao FROM transacoes_internas WHERE status = 'PENDING' and data_processar = $1 GROUP BY data_processar, id_usuario, plano_usuario, url_loja, status, gateway ORDER BY id_usuario asc ",[hoje], (error, results) => {
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

module.exports.GetTransacoesInternasPorLoja = (req, res, next) => {
    try {
        const data_processar = moment().format('YYYY-MM-DD');
        pool.query("SELECT * FROM transacoes_internas WHERE status = 'PENDING' and data_processar = $1 ORDER BY id_usuario ASC",[data_processar], (error, results) => {
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

module.exports.GetTransacoesByGatewayINTERNAL = (gateway) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM transacoes where gateway = $1', [gateway], (error, results) => {
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

module.exports.GetTransacoesPendentesByGatewayINTERNAL = (gateway) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query("SELECT * FROM transacoes where gateway = $1 and status = 'PENDING'", [gateway], (error, results) => {
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

module.exports.GetTransacoesByID_IDUsuario = (shop, id_usuario, id) => {
    try {
        pool.query('SELECT * FROM transacoes where url_loja = $1 and id_usuario =$2 and id=$3', [shop, id_usuario, id], (error, results) => {
            if (error) {
                throw error
            }
            resolve(results.rows[0]);
        })
    } catch (error) {
        reject(error);
    }
}


module.exports.insereTransacao = (id_usuario, url_loja, JSON_FrontEndUserData, JSON_BackEndPayment, JSON_GW_Response, JSON_ShopifyOrder, JSON_ShopifyResponse, status, gateway) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query('INSERT INTO transacoes (id_usuario, url_loja, json_front_end_user_data, json_back_end_payment, json_gw_response, json_shopify_order, json_shopify_response, status, gateway) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)', [id_usuario, url_loja, JSON_FrontEndUserData, JSON_BackEndPayment, JSON_GW_Response, JSON_ShopifyOrder, JSON_ShopifyResponse, status, gateway], (error, results) => {
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

module.exports.insereTransacaoInterna = (data, data_processar, id_usuario, plano_usuario, url_loja, json_front_end_user_data, json_back_end_payment, json_gw_response, status, valor_comissao, gateway) => {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query('INSERT INTO transacoes_internas (data, data_processar, id_usuario, plano_usuario, url_loja, json_front_end_user_data, json_back_end_payment, json_gw_response, status, valor_comissao, gateway) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9, $10, $11) ON CONFLICT (id_usuario, json_front_end_user_data) DO UPDATE SET data=$1, data_processar=$2, id_usuario=$3, plano_usuario=$4, url_loja=$5, json_front_end_user_data=$6, json_back_end_payment=$7, json_gw_response=$8, status=$9, valor_comissao=$10, gateway=$11', [data, data_processar, id_usuario, plano_usuario, url_loja, json_front_end_user_data, json_back_end_payment, json_gw_response, status, valor_comissao, gateway], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(1);
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
                        utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LRefoundShopify, headerAditional, valueHeaderAditional, 'POST')
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

module.exports.UpdateTransacaoShopifyOrder = (req, res, next) => {
    try {
        const { order_id, json_shopify_order } = req.body;
        pool.query("select * from transacoes where json_shopify_response ->> 'id' = $1", [order_id], (error, results) => {
            if (error) {
                throw error
            }
            results.rows.forEach((obj, i) => {
                pool.query("UPDATE transacoes SET json_shopify_response=$1 WHERE id=$2", [json_shopify_order, obj.id], (error, resultsUpdate) => {
                    if (error) {
                        throw error
                    }
                    req.body.id_usuario = obj.id_usuario;
                    fulfillments.SaveFulFillment(req, res, next);
                    res.status(200).send(results.rows);
                    res.end();
                });
            })

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateTransacaoShopifyOrderStatus = (order_id, json_shopify_order, status) => {
    return new Promise((resolve, reject) => {
        try {
            
            const LQuery = "SELECT id, json_shopify_response, (json_shopify_response->'order'->>'id')::bigint as order_id FROM transacoes WHERE (json_shopify_response->'order'->>'id')::bigint = $1";
            pool.query(LQuery, [order_id], (error, results) => {
                if (error) {
                    throw error
                }
                results.rows.forEach((obj, i) => {
                    pool.query("UPDATE transacoes SET json_shopify_response=$1,  status = $3 WHERE id=$2", [json_shopify_order, obj.id, status], (error, resultsUpdate) => {
                        if (error) {
                            throw error
                        }                       
                        resolve(resultsUpdate.rowCount);
                    });
                })

            })
        } catch (error) {
            reject(error);
        }
    })

}



