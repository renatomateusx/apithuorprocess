var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
module.exports.GetCheckoutAtivo = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM checkouts where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
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
                            "amount": parseFloat(Pjson.paymentData.transaction_amount)
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

module.exports.DoPay = (req, res, next) => {
    try {
        const { pay } = req.body;
        const LJSON = JSON.parse(Buffer.from(pay, 'base64').toString());
        ///console.log("Pay", LJSON);
        mercadopago.configurations.setAccessToken(LJSON.dadosCheckout.token_acesso);
        var paymentData = {
            transaction_amount: parseFloat(LJSON.paymentData.transaction_amount),
            token: LJSON.paymentData.token,
            description: LJSON.paymentData.description,
            installments: parseInt(LJSON.paymentData.installments),
            payment_method_id: LJSON.paymentData.payment_method_id,
            payer: LJSON.paymentData.payer
        }
        //console.log("paymentData", paymentData);
        mercadopago.payment.save(paymentData)
            .then(async function (data) {
                const DataResponse = data.response;
                ///console.log(data.response);
                if (data.response.status == 'approved') {
                    const LShopifyOrder = await mountJSONShopifyOrder(LJSON, 'paid');
                    const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.RESOURCE_ORDERS);
                    const urlShopify = format("https://{}:{}@{}", LJSON.dadosLoja.chave_api_key, LJSON.dadosLoja.senha, LJSON.dadosLoja.url_loja);
                    var headerAditional = "X-Shopify-Access-Token";
                    var valueHeaderAditional = LJSON.dadosLoja.senha;
                    //console.log(ordersShopify);
                    //console.log(urlShopify);
                    utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                        .then(async retornoShopify => {
                            const RetornoShopifyJSON = retornoShopify.body;
                            insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, paymentData, data.response, LShopifyOrder, retornoShopify.body, 'aprovada')
                                .then((retornoInsereTransacao) => {
                                    res.status(200).send(DataResponse);
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
                    console.log("Response", data.response);
                    res.status(200).send(data.response);
                }

            }).catch(function (error) {
                console.log("Erro MP", error);
                if (error.cause != undefined) {
                    console.log(error.cause[0].code);
                    res.status(202).send(error.cause[0].code);
                }
                else {
                    res.status(202).send(error);
                }
            });


    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.DoPayTicket = (req, res, next) => {
    try {
        const { pay } = req.body;
        const LJSON = JSON.parse(Buffer.from(pay, 'base64').toString());
        console.log("Pay", LJSON);
        mercadopago.configurations.setAccessToken(LJSON.dadosCheckout.token_acesso);
        var FirstLastName = LJSON.dadosComprador.nome_completo.split(" ");
        var paymentData = {
            transaction_amount: parseFloat(LJSON.paymentData.transaction_amount),
            description: LJSON.paymentData.description,
            payment_method_id: LJSON.paymentData.payment_method_id,
            payer: {
                email: LJSON.dadosComprador.email,
                first_name: FirstLastName[0],
                last_name: FirstLastName[FirstLastName.length -1],
                identification: {
                    type: 'CPF',
                    number: LJSON.dadosComprador.cpf.replace(/[.-]/g, '')
                },
                address: {
                    zip_code: LJSON.dadosComprador.cep.replace(/-/g, ''),
                    street_name: LJSON.dadosComprador.endereco,
                    street_number: LJSON.dadosComprador.numero_porta,
                    neighborhood: LJSON.dadosComprador.bairro,
                    city: LJSON.dadosComprador.cidade,
                    federal_unit: LJSON.dadosComprador.estado
                }
            }
        }
        console.log("paymentData", paymentData);
        mercadopago.payment.create(paymentData)
            .then(async function (data) {
                const DataResponse = data.response;
                console.log(data.response);
                if (data.response.status == 'pending') {
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
                            insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, paymentData, data.response, LShopifyOrder, retornoShopify.body, 'pendente')
                                .then((retornoInsereTransacao) => {
                                    res.status(200).send(DataResponse);
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
                    console.log("Response", data.response);
                    res.status(200).send(data.response);
                }

            }).catch(function (error) {
                console.log("Erro MP", error);
                if (error.cause != undefined) {
                    console.log(error.cause[0].code);
                    res.status(202).send(error.cause[0].code);
                }
                else {
                    res.status(202).send(error);
                }
            });


    } catch (error) {
        res.json(error);
        res.end();
    }
}