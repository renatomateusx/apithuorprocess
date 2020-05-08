var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');

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

module.exports.GetCheckoutAtivoInternal = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id_usuario } = req.body;
            pool.query('SELECT * FROM checkouts where id_usuario = $1 and status = 1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows[0]);
            })
        } catch (error) {
            reject(error);
        }
    });
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

module.exports.DoPay = (req, res, next) => {
    try {
        const { pay } = req.body;
        const LJSON = JSON.parse(Buffer.from(pay, 'base64').toString());
        ///console.log("Pay", LJSON);
        if (LJSON.dadosCheckout.gateway == 1) {
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
                        utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                            .then(async retornoShopify => {
                                const RetornoShopifyJSON = retornoShopify.body;
                                transacoes.insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, paymentData, data.response, LShopifyOrder, retornoShopify.body, 'aprovada')
                                    .then((retornoInsereTransacao) => {
                                        const response = {
                                            dataGateway: DataResponse,
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
        }

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
                last_name: FirstLastName[FirstLastName.length - 1],
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
                            transacoes.insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, paymentData, data.response, LShopifyOrder, retornoShopify.body, 'pendente')
                                .then((retornoInsereTransacao) => {
                                    const response = {
                                        dataGateway: DataResponse,
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

module.exports.GetIntegracaoCheckout = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM integracao_checkout', (error, results) => {
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

module.exports.GetIntegracaoCheckoutByID = (req, res, next) => {
    try {
        const { id_usuario, id } = req.body;

        pool.query('SELECT * FROM checkouts where id_usuario = $1 and gateway=$2', [id_usuario, id], (error, results) => {
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
module.exports.InsertCheckoutMP = (req, res, next) => {
    try {
        const { id_usuario, status, nome, nome_fatura, processa_automaticamente, chave_publica, token_acesso, ativa_boleto, gateway } = req.body;
        
        console.log(ativa_boleto);
        pool.query('INSERT INTO checkouts (id_usuario, status, nome, nome_fatura, captura_auto, chave_publica, token_acesso, ativa_boleto, gateway)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (gateway,id_usuario) DO UPDATE SET status=$2, nome=$3, nome_fatura=$4, captura_auto=$5, chave_publica=$6, token_acesso=$7, ativa_boleto=$8, gateway=$9 ', [id_usuario, status, nome, nome_fatura, processa_automaticamente, chave_publica, token_acesso, parseInt(ativa_boleto), gateway], (error, results) => {
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

module.exports.UpdateStatusMP = (req, res, next) => {
    try {
        const { id_usuario, gateway, status } = req.body;
        console.log(req.body);
        pool.query('UPDATE checkouts SET status=$3 where id_usuario = $1 and gateway=$2', [id_usuario, gateway, status], (error, results) => {
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

module.exports.UpdateAtivaBoletoMP = (req, res, next) => {
    try {
        const { id_usuario, gateway, ativa_boleto } = req.body;
        console.log(req.body);
        pool.query('UPDATE checkouts SET ativa_boleto=$3 where id_usuario = $1 and gateway=$2', [id_usuario, gateway, parseInt(ativa_boleto)], (error, results) => {
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
module.exports.UpdateAutoProcessamentoMP = (req, res, next) => {
    try {
        const { id_usuario, gateway, processa_automaticamente } = req.body;
        console.log(req.body);
        pool.query('UPDATE checkouts SET captura_auto=$3 where id_usuario = $1 and gateway=$2', [id_usuario, gateway, processa_automaticamente], (error, results) => {
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
