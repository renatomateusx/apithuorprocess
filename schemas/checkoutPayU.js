var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');
var parser = require('xml2json-light');
const moment = require('moment');
const clientes = require('../schemas/clientes');
const funcionalidadesShopify = require('../resources/funcionalidadesShopify');

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

module.exports.DoPay = (req, res, next) => {

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
        const Lurl = "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi";
        //console.log(LJSON.paymentData);
        utilis.makeAPICallExternalParamsJSON(Lurl, "", LJSON.paymentData, undefined, undefined, "POST")
            .then(async (resRet) => {

                var json = parser.xml2json(resRet.body);
                console.log("LID", json.paymentResponse);
                if (json.paymentResponse.error != null) {
                    res.status(422).send(json.paymentResponse);
                    res.end();
                    return;
                }
                if (json.paymentResponse.transactionResponse.state.toUpperCase() == 'APPROVED') {
                    LJSON.dadosComprador.data = moment().format('YYYY-MM-DD HH:mm:ss');
                    LJSON.dadosComprador.id_transacao = json.paymentResponse.transactionResponse.orderId;
                    LJSON.dadosComprador.id_transacao_payu = json.paymentResponse.transactionResponse.transactionId;
                    LJSON.dadosComprador.valorParcela = (parseFloat(data.response.transaction.order.additionalValues.TX_VALUE.value) / data.response.transaction.extraParameters.INSTALLMENTS_NUMBER);
                    var responseShopify = await funcionalidadesShpify.enviaOrdemShopify(LJSON, json.paymentResponse, LJSON.paymentData, json.paymentResponse.transactionResponse.state.toUpperCase());
                    var plataformasResponse = {
                        shopify: responseShopify,
                        woo: 'notYet',
                    }
                    res.status(200).send(responseShopify);


                    // const LShopifyOrder = await mountJSONShopifyOrder(LJSON, 'paid'); // MUDAR O PENDING PARA PAID
                    // const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.RESOURCE_ORDERS);
                    // const urlShopify = format("https://{}:{}@{}", LJSON.dadosLoja.chave_api_key, LJSON.dadosLoja.senha, LJSON.dadosLoja.url_loja);
                    // var headerAditional = "X-Shopify-Access-Token";
                    // var valueHeaderAditional = LJSON.dadosLoja.senha;
                    // utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                    //     .then(async retornoShopify => {
                    //         const RetornoShopifyJSON = retornoShopify.body;
                    //         insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, LJSON.paymentData, json.paymentResponse, LShopifyOrder, retornoShopify.body, 'aprovada', 2)
                    //             .then(async (retornoInsereTransacao) => {
                    //                 const LUpdate = await clientes.UpdateLead(LJSON.dadosComprador.email, LJSON.produtos);
                    //                 const response = {
                    //                     dataGateway: json.paymentResponse,
                    //                     dataStore: RetornoShopifyJSON
                    //                 }
                    //                 res.status(200).send(response);
                    //             })
                    //             .catch((error) => {
                    //                 console.log("Erro ao inserir transação no banco", error);
                    //             })
                    //     })
                    //     .catch(error => {
                    //         console.log("Erro ao enviar informação do checkout para a shopify", error);
                    //     })
                }
                else if (json.paymentResponse.transactionResponse.state.toUpperCase() == 'PENDING') {
                    LJSON.dadosComprador.data = moment().format('YYYY-MM-DD HH:mm:ss');
                    LJSON.dadosComprador.id_transacao = json.paymentResponse.transactionResponse.orderId;
                    LJSON.dadosComprador.id_transacao_payu = json.paymentResponse.transactionResponse.transactionId;
                    LJSON.dadosComprador.barcode = json.paymentResponse.transactionResponse.extraParameters.BAR_CODE;
                    LJSON.dadosComprador.urlBoleto = json.paymentResponse.transactionResponse.extraParameters.URL_BOLETO_BANCARIO;
                    LJSON.dadosComprador.vencimentoBoleto = moment(json.paymentResponse.transactionResponse.extraParameters.EXPIRATION_DATE).format('YYYY-MM-DD HH:mm:ss');
                    var responseShopify = await funcionalidadesShpify.enviaOrdemShopify(LJSON, json.paymentResponse, LJSON.paymentData, json.paymentResponse.transactionResponse.state.toUpperCase());
                    var plataformasResponse = {
                        shopify: responseShopify,
                        woo: 'notYet',
                    }
                    res.status(200).send(responseShopify);


                    // const LShopifyOrder = await mountJSONShopifyOrder(LJSON, 'pending');
                    // const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.RESOURCE_ORDERS);
                    // const urlShopify = format("https://{}:{}@{}", LJSON.dadosLoja.chave_api_key, LJSON.dadosLoja.senha, LJSON.dadosLoja.url_loja);
                    // var headerAditional = "X-Shopify-Access-Token";
                    // var valueHeaderAditional = LJSON.dadosLoja.senha;
                    // //console.log(ordersShopify);
                    // //console.log(urlShopify);
                    // utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                    //     .then(async retornoShopify => {
                    //         const RetornoShopifyJSON = retornoShopify.body;
                    //         insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, LJSON.paymentData, resRet.body, LShopifyOrder, retornoShopify.body, 'pendente', 2)
                    //             .then(async (retornoInsereTransacao) => {
                    //                 const LUpdate = await clientes.UpdateLead(LJSON.dadosComprador.email, LJSON.produtos);
                    //                 const response = {
                    //                     dataGateway: json.paymentResponse,
                    //                     dataStore: RetornoShopifyJSON
                    //                 }
                    //                 res.status(200).send(response);
                    //             })
                    //             .catch((error) => {
                    //                 console.log("Erro ao inserir transação no banco", error);
                    //             })
                    //     })
                    //     .catch(error => {
                    //         console.log("Erro ao enviar informação do checkout para a shopify", error);
                    //     })
                }
                else if (json.paymentResponse.transactionResponse.state.toUpperCase() == 'DECLINED') {
                    console.log("Response", json.paymentResponse);
                    res.status(200).send(json.paymentResponse);
                }
                else {
                    console.log("Response", json.paymentResponse);
                    res.status(200).send(json.paymentResponse);
                }
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

module.exports.ReembolsarPedidoPayUByID = (req, res, next) => {
    try {
        const { shop, id_usuario, id, lvalue } = req.body;
        pool.query('SELECT * FROM transacoes where url_loja = $1 and id_usuario =$2 and id=$3', [shop, id_usuario, id], async (error, results) => {
            if (error) {
                throw error
            }
            const LRetornoPedido = results.rows[0];
            const LDadosLoja = await integracaoShopify.GetDadosLojaInternal(shop);
            const LDadosGateway = await checkoutsSchema.GetCheckoutAtivoInternal(req, res, next);
            if (LDadosGateway.api_login != undefined && LDadosGateway.gateway == 3) {
                const LFrontEnd = JSON.parse(LRetornoPedido.json_front_end_user_data);
                const LResponseGW = JSON.parse(LRetornoPedido.json_gw_response);
                const LResponseMKTPlace = JSON.parse(LRetornoPedido.json_shopify_response);
                const ItemsRefound = await getItemsRefound(LResponseMKTPlace.order.line_items);
                const ValorRefund = lvalue || LResponseGW.transaction_details.total_paid_amount;

                var LRefund = {
                    "language": "pt",
                    "command": "SUBMIT_TRANSACTION",
                    "merchant": {
                        "apiKey": LDadosGateway.api_key,
                        "apiLogin": LDadosGateway.api_login
                    },
                    "transaction": {
                        "order": {
                            "id": LFrontEnd.dadosComprador.id_transacao
                        },
                        "type": "REFUND",
                        "reason": "Reembolso Solicitado à Pedido do Vendedor",
                        "parentTransactionId": LFrontEnd.dadosComprador.id_transacao_payu
                    },
                    "test": false

                };
                const Lurl = "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi";
                //console.log(Lurl);

                utilis.makeAPICallExternalParamsJSON(Lurl, "", LRefund, undefined, undefined, "POST")
                    .then(async (resRet) => {

                        const LResponse = await funcionalidadesShopify.refoundShopify(LResponseGW, LDadosLoja, ItemsRefound, ValorRefund, 2)
                        res.status(200).send(LResponse);


                        // var LRefoundShopify = {
                        //     "refund": {
                        //         "currency": "BRL",
                        //         "notify": true,
                        //         "note": "Cancelada pelo Vendedor",
                        //         "shipping": {
                        //             "full_refund": true
                        //         },
                        //         "refund_line_items": ItemsRefound,
                        //         "transactions": [
                        //             {
                        //                 "amount": ValorRefund,
                        //                 "kind": "refund",
                        //                 "gateway": "PayU"
                        //             }
                        //         ]
                        //     }
                        // }
                        // const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.REFOUND_ORDER);
                        // const urlShopify = format("https://{}:{}@{}", LDadosLoja.chave_api_key, LDadosLoja.senha, LDadosLoja.url_loja);
                        // var headerAditional = "X-Shopify-Access-Token";
                        // var valueHeaderAditional = LDadosLoja.senha;
                        // utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LRefoundShopify, headerAditional, valueHeaderAditional, 'POST')
                        //     .then(async retornoShopify => {
                        //         const RetornoShopifyJSON = retornoShopify.body;
                        //         transacoes.updateTransacao(id_usuario, LDadosLoja.url_loja, data.response, 'reembolsada')
                        //             .then((retornoInsereTransacao) => {
                        //                 const response = {
                        //                     dataGateway: data.response,
                        //                     dataStore: RetornoShopifyJSON
                        //                 }
                        //                 res.status(200).send(response);
                        //             })
                        //             .catch((error) => {
                        //                 console.log("Erro ao inserir transação no banco", error);
                        //             })
                        //     })
                        //     .catch(error => {
                        //         console.log("Erro ao enviar informação do checkout para a shopify", error);
                        //     })

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

// async function mountJSONShopifyOrder(Pjson, situacao) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const LShopifyOrder = {
//                 "order": {
//                     "line_items": Pjson.produtos,
//                     "customer": {
//                         "first_name": Pjson.dadosComprador.nome_completo,
//                         "last_name": "",
//                         "email": Pjson.dadosComprador.email
//                     },
//                     "billing_address": {
//                         "first_name": Pjson.dadosComprador.nome_completo,
//                         "last_name": "",
//                         "address1": Pjson.dadosComprador.endereco,
//                         "phone": Pjson.dadosComprador.telefone,
//                         "city": Pjson.dadosComprador.cidade,
//                         "province": Pjson.dadosComprador.estado,
//                         "country": "Brasil",
//                         "zip": Pjson.dadosComprador.cep
//                     },
//                     "shipping_address": {
//                         "first_name": Pjson.dadosComprador.nome_completo,
//                         "last_name": "",
//                         "address1": Pjson.dadosComprador.endereco,
//                         "phone": Pjson.dadosComprador.telefone,
//                         "city": Pjson.dadosComprador.cidade,
//                         "province": Pjson.dadosComprador.estado,
//                         "country": "Brasil",
//                         "zip": Pjson.dadosComprador.cep
//                     },
//                     "email": Pjson.dadosComprador.email,
//                     "transactions": [
//                         {
//                             "kind": "authorization",
//                             "status": "success",
//                             "amount": parseFloat(Pjson.paymentData.amount.value)
//                         }
//                     ],
//                     "financial_status": situacao
//                 }
//             };
//             resolve(LShopifyOrder);

//         } catch (error) {
//             reject(error);

//         }
//     });
// }