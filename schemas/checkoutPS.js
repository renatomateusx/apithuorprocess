var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

module.exports.StartSessionPS = (req, res, next) => {

    try {
        const { email, token } = req.body;
        var LParams = "email=" + email;
        LParams = LParams + "&token=" + token;
        const Lurl = "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=" + email + "&token=" + token + "";
        console.log(Lurl);
        utilis.makeAPICallExternalParamsPS(Lurl)
            .then(async (resRet) => {
                const LRetJson = xmlParser.xml2json(resRet, { compact: true });
                const LIDSession = JSON.parse(LRetJson).session.id._text;
                console.log("LID", LIDSession);
                res.status(200).send(LIDSession);
                res.end();
            })
            .catch((error) => {
                console.log("Error", error);
                res.status(200).send(error);
                res.end();
            })
    } catch (error) {
        res.json(error);
        res.end();
    }

}
function insereTransacao(id_usuario, url_loja, JSON_FrontEndUserData, JSON_BackEndPayment, JSON_GW_Response, JSON_ShopifyOrder, JSON_ShopifyResponse, status, gateway) {
    return new Promise(async (resolve, reject) => {
        try {
            pool.query('INSERT INTO transacoes (id_usuario, url_loja, json_front_end_user_data, json_back_end_payment, json_gw_response, json_shopify_order, json_shopify_response, status, gateway) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id_usuario, url_loja, JSON_FrontEndUserData, JSON_BackEndPayment, JSON_GW_Response, JSON_ShopifyOrder, JSON_ShopifyResponse, status, gateway], (error, results) => {
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

module.exports.PublicKey = (req, res, next) => {

    try {
        const { type, token } = req.body;
        var LBody = {
            "type": type
        }
        var LParams = "email=" + type;
        LParams = LParams + "&token=" + token;
        const Lurl = "https://sandbox.api.pagseguro.com/public-keys";
        console.log(LParams);
        utilis.makeAPICallExternalParamsJSON(Lurl, "", LBody, "Authorization", "Bearer " + token, "POST")
            .then(async (resRet) => {
                //const LRetJson = xmlParser.xml2json(resRet, {compact: true});
                //const LIDSession = JSON.parse(LRetJson).session.id._text;
                console.log("LID", JSON.parse(resRet.body).public_key);
                res.status(200).send(JSON.parse(resRet.body).public_key);
                res.end();
            })
            .catch((error) => {
                console.log("Error", error);
                res.status(200).send(error);
                res.end();
            })
    } catch (error) {
        res.json(error);
        res.end();
    }

}

module.exports.DoPayPagSeguroCard = (req, res, next) => {

    try {
        const { LCrypto } = req.body;
        const LJSON = JSON.parse(Buffer.from(LCrypto, 'base64').toString());
        //console.log(LJSON);
        //const CardToken = JSON.stringify(LJSON.paymentData.payment_method.card);
        //const LJSONCardToken = JSON.parse(CardToken)
        //console.log(LJSONCardToken);
        //LJSON.paymentData.payment_method.card = {encrypted: LJSONCardToken.encrypted};

        //var LParams = "email=" + email;
        //LParams = LParams + "&token=" + token;
        const Lurl = "https://sandbox.api.pagseguro.com/charges";
        //console.log(Lurl);
        var LHeaderKey = [];
        var LHeaderValue = [];
        LHeaderKey.push('Authorization');
        LHeaderValue.push('Bearer ' + LJSON.token);
        LHeaderKey.push('X-api-version');
        LHeaderValue.push('1.0');
        LHeaderKey.push('X-idempotency-key');
        LHeaderValue.push('');
        LJSON.paymentData.amount.value = parseFloat(LJSON.paymentData.amount.value);
        //console.log(LJSON.paymentData);
        utilis.makeAPICallExternalParamsJSONHeadersArray(Lurl, "", LJSON.paymentData, LHeaderKey, LHeaderValue, "POST")
            .then(async (resRet) => {
                //console.log("LID", resRet.body);
                if (resRet.body.indexOf('error_messages') > -1) {
                    res.status(422).send(resRet.body);
                    res.end();
                    return;
                }
                if (JSON.parse(resRet.body).status.toUpperCase() == 'PAID') {
                    const LShopifyOrder = await mountJSONShopifyOrder(LJSON, 'paid'); // MUDAR O PENDING PARA PAID
                    const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.RESOURCE_ORDERS);
                    const urlShopify = format("https://{}:{}@{}", LJSON.dadosLoja.chave_api_key, LJSON.dadosLoja.senha, LJSON.dadosLoja.url_loja);
                    var headerAditional = "X-Shopify-Access-Token";
                    var valueHeaderAditional = LJSON.dadosLoja.senha;
                    utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                        .then(async retornoShopify => {
                            const RetornoShopifyJSON = retornoShopify.body;
                            insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, LJSON.paymentData, resRet.body, LShopifyOrder, retornoShopify.body, 'aprovada', 2)
                                .then((retornoInsereTransacao) => {
                                    const response = {
                                        dataGateway: resRet.body,
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
                }
                else if (JSON.parse(resRet.body).status.toUpperCase() == 'WAITING') {
                    const LShopifyOrder = await mountJSONShopifyOrder(LJSON, 'pending');
                    const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.RESOURCE_ORDERS);
                    const urlShopify = format("https://{}:{}@{}", LJSON.dadosLoja.chave_api_key, LJSON.dadosLoja.senha, LJSON.dadosLoja.url_loja);
                    var headerAditional = "X-Shopify-Access-Token";
                    var valueHeaderAditional = LJSON.dadosLoja.senha;
                    //console.log(ordersShopify);
                    //console.log(urlShopify);
                    utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                        .then(async retornoShopify => {
                            const RetornoShopifyJSON = retornoShopify.body;
                            insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, LJSON.paymentData, resRet.body, LShopifyOrder, retornoShopify.body, 'pendente', 2)
                                .then((retornoInsereTransacao) => {
                                    const response = {
                                        dataGateway: resRet.body,
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
                }
                else {
                    console.log("Response", resRet.body);
                    res.status(200).send(resRet.body);
                }
                //res.status(200).send(JSON.parse(resRet.body).public_key);
                //res.end();
            })
            .catch((error) => {
                console.log("Error", error);
                res.status(422).send(error);
                res.end();
            })
    } catch (error) {
        res.json(error);
        res.end();
    }

}

module.exports.ReembolsarPedidoPSByID = (req, res, next) => {
    try {
        const { shop, id_usuario, id, lvalue } = req.body;
        pool.query('SELECT * FROM transacoes where url_loja = $1 and id_usuario =$2 and id=$3', [shop, id_usuario, id], async (error, results) => {
            if (error) {
                throw error
            }
            const LRetornoPedido = results.rows[0];
            const LDadosLoja = await integracaoShopify.GetDadosLojaInternal(shop);
            const LDadosGateway = await checkoutsSchema.GetCheckoutAtivoInternal(req, res, next);
            if (LDadosGateway.token_acesso != undefined && LDadosGateway.gateway == 2) {
                const LResponseGW = JSON.parse(LRetornoPedido.json_gw_response);
                const LResponseMKTPlace = JSON.parse(LRetornoPedido.json_shopify_response);
                const ItemsRefound = await getItemsRefound(LResponseMKTPlace.order.line_items);
                const ValorRefund = lvalue || LResponseGW.transaction_details.total_paid_amount;

                var LRefund = {
                    "amount": {
                        "value": ValorRefund
                    }
                };
                const Lurl = "https://sandbox.api.pagseguro.com/"+LResponseGW.id+"/cancel";
                //console.log(Lurl);
                var LHeaderKey = [];
                var LHeaderValue = [];
                LHeaderKey.push('Authorization');
                LHeaderValue.push('Bearer ' + LJSON.token);
                LHeaderKey.push('X-api-version');
                LHeaderValue.push('1.0');
                LHeaderKey.push('X-idempotency-key');
                LHeaderValue.push('');

                utilis.makeAPICallExternalParamsJSONHeadersArray(Lurl, "", LRefund, LHeaderKey, LHeaderValue, "POST")
                    .then(async (resRet) => {
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
                                        "amount": ValorRefund,
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

async function mountJSONShopifyOrder(Pjson, situacao) {
    return new Promise(async (resolve, reject) => {
        try {
            const LShopifyOrder = {
                "order": {
                    "line_items": Pjson.produtos,
                    "customer": {
                        "first_name": Pjson.dadosComprador.nome_completo,
                        "last_name": "",
                        "email": Pjson.dadosComprador.email
                    },
                    "billing_address": {
                        "first_name": Pjson.dadosComprador.nome_completo,
                        "last_name": "",
                        "address1": Pjson.dadosComprador.endereco,
                        "phone": Pjson.dadosComprador.telefone,
                        "city": Pjson.dadosComprador.cidade,
                        "province": Pjson.dadosComprador.estado,
                        "country": "Brasil",
                        "zip": Pjson.dadosComprador.cep
                    },
                    "shipping_address": {
                        "first_name": Pjson.dadosComprador.nome_completo,
                        "last_name": "",
                        "address1": Pjson.dadosComprador.endereco,
                        "phone": Pjson.dadosComprador.telefone,
                        "city": Pjson.dadosComprador.cidade,
                        "province": Pjson.dadosComprador.estado,
                        "country": "Brasil",
                        "zip": Pjson.dadosComprador.cep
                    },
                    "email": Pjson.dadosComprador.email,
                    "transactions": [
                        {
                            "kind": "authorization",
                            "status": "success",
                            "amount": parseFloat(Pjson.paymentData.amount.value)
                        }
                    ],
                    "financial_status": situacao
                }
            };
            resolve(LShopifyOrder);

        } catch (error) {
            reject(error);

        }
    });
}