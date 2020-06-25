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
const checkoutsSchema = require('../schemas/checkouts');
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
      const Lurl = constantes.API_PAYU;
      LJSON.paymentData.test = constantes.CONSTANTE_TESTES;
      //console.log(JSON.stringify(LJSON));

      /*LJSON.paymentData.transaction.creditCard.name = "APPROVED";  */
      utilis.makeAPICallExternalParamsJSON(Lurl, "", LJSON.paymentData, undefined, undefined, "POST")
         .then(async (resRet) => {
            var json = parser.xml2json(resRet.body);
            //console.log("LID", JSON.stringify(json.paymentResponse));
            if (json.paymentResponse.error != null) {
               res.status(422).send(json.paymentResponse);
               res.end();
               return;
            }
            // var Resp = {

            //         "code": "SUCCESS",
            //         "error": null,
            //         "transactionResponse": {
            //            "orderId": 43626780,
            //            "transactionId": "63091676-673d-46bf-a283-54e686ba0238",
            //            "state": "PENDING",
            //            "paymentNetworkResponseCode": null,
            //            "paymentNetworkResponseErrorMessage": null,
            //            "trazabilityCode": null,
            //            "authorizationCode": null,
            //            "pendingReason": "AWAITING_NOTIFICATION",
            //            "responseCode": "PENDING_TRANSACTION_CONFIRMATION",
            //            "errorCode": null,
            //            "responseMessage": null,
            //            "transactionDate": null,
            //            "transactionTime": null,
            //            "operationDate": null,
            //            "extraParameters": {
            //               "URL_PAYMENT_RECEIPT_HTML": "https://gateway.payulatam.com/ppp-web-gateway/bl.zul?transactionId=63091676-673d-46bf-a283-54e686ba0238&orderId=43626780&signature=647b061ddef2a25fd19cb362860e1d21ef59e16a",
            //               "EXPIRATION_DATE": 1399507200000,
            //               "URL_BOLETO_BANCARIO": "https://gateway.payulatam.com/ppp-web-gateway/bl.zul?transactionId=63091676-673d-46bf-a283-54e686ba0238&orderId=43626780&signature=647b061ddef2a25fd19cb362860e1d21ef59e16a",
            //               "BAR_CODE": "34191.75389 38894.912930 81898.480009 9 60560000010000"
            //            }
            //         }
            // }
            // json.paymentResponse = Resp;
            if (json.paymentResponse.transactionResponse.state.toUpperCase() == 'APPROVED') {
               LJSON.dadosComprador.data = moment().format('YYYY-MM-DD HH:mm:ss');
               LJSON.dadosComprador.id_transacao = json.paymentResponse.transactionResponse.orderId;
               LJSON.dadosComprador.id_transacao_payu = json.paymentResponse.transactionResponse.transactionId;
               LJSON.dadosComprador.valorParcela = (parseFloat(LJSON.dadosComprador.valor.amount.summary.paid) / parseInt(LJSON.dadosComprador.parcela));
               var responseShopify = await funcionalidadesShopify.enviaOrdemShopify(LJSON, json.paymentResponse, LJSON.paymentData, 'paid', constantes.GATEWAY_PayU);
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
               var responseShopify = await funcionalidadesShopify.enviaOrdemShopify(LJSON, json.paymentResponse, LJSON.paymentData, 'pending', constantes.GATEWAY_PayU);
               var plataformasResponse = {
                  shopify: responseShopify,
                  woo: 'notYet',
               }
               const LDadosComprador = responseShopify.dadosComprador.dadosComprador;
               const LDadosLoja = responseShopify.dadosComprador.dadosLoja;
               utilisM.SendEmailBoletoInternal(LDadosComprador, LDadosLoja);
               res.status(200).send(responseShopify);

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


module.exports.CheckStatusBoleto = (idTransaction, LDadosCheckout) => {
   return new Promise(async (resolve, reject) => {
      try {

         const LDadosGateway = await checkoutsSchema.GetCheckoutAtivoInternalAlt(LDadosCheckout.id_usuario);
         var LConsulta =
         {
            "test": constantes.CONSTANTE_TESTES,
            "language": "pt",
            "command": "ORDER_DETAIL",
            "merchant": {
               "apiKey": LDadosGateway.api_key,
               "apiLogin": LDadosGateway.api_login
            },
            "details": {
               "orderId": idTransaction
            }
         }
         const URL = constantes.API_PAYU_REPORT;
         //console.log(URL);
         //const LConsultaPagamento = await utilis.makeAPICallExternalParamsJSON(URL, "", LConsulta, undefined, undefined, "POST");
         //console.log(LConsultaPagamento.body);
         const LConsultaPagamento = {
            body: {
               "code": "SUCCESS",
               "error": null,
               "result": {
                  "payload": {
                     "id": 2637540,
                     "accountId": 512321,
                     "status": "DECLINED",
                     "referenceCode": "testColombia-reports1",
                     "description": "Test order Colombia",
                     "airlineCode": null,
                     "language": "es",
                     "notifyUrl": "http://pruebaslap.xtrweb.com/lap/pruebconf.php",
                     "shippingAddress": {
                        "street1": null,
                        "street2": null,
                        "city": null,
                        "state": null,
                        "country": "CO",
                        "postalCode": null,
                        "phone": null
                     },
                     "buyer": {
                        "merchantBuyerId": null,
                        "fullName": "José Pérez",
                        "emailAddress": "test@payulatam.com",
                        "contactPhone": null
                     },
                     "transactions": [
                        {
                           "id": "41bb0d7d-dc98-4eeb-a128-ce5b7366bcfa",
                           "order": null,
                           "creditCard": {
                              "maskedNumber": "411111******1111",
                              "name": "test",
                              "issuerBank": null
                           },
                           "type": "AUTHORIZATION_AND_CAPTURE",
                           "parentTransactionId": null,
                           "paymentMethod": "VISA",
                           "source": null,
                           "paymentCountry": "CO",
                           "transactionResponse": {
                              "state": "DECLINED",
                              "paymentNetworkResponseCode": null,
                              "paymentNetworkResponseErrorMessage": null,
                              "trazabilityCode": null,
                              "authorizationCode": null,
                              "pendingReason": null,
                              "responseCode": "ENTITY_DECLINED",
                              "errorCode": null,
                              "responseMessage": null,
                              "transactionDate": null,
                              "transactionTime": null,
                              "operationDate": null,
                              "extraParameters": null
                           },
                           "deviceSessionId": null,
                           "ipAddress": "127.0.0.1",
                           "cookie": "cookie_52278879710130",
                           "userAgent": "Firefox",
                           "expirationDate": null,
                           "payer": {
                              "merchantPayerId": null,
                              "fullName": "José Pérez",
                              "billingAddress": null,
                              "emailAddress": "test@payulatam.com",
                              "contactPhone": null,
                              "dniNumber": null
                           },
                           "additionalValues": {
                              "PM_TAX_ADMINISTRATIVE_FEE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "TX_ADDITIONAL_VALUE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "PM_TAX_ADMINISTRATIVE_FEE_RETURN_BASE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "TX_VALUE": {
                                 "value": 6000,
                                 "currency": "COP"
                              },
                              "PM_TAX_RETURN_BASE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "PM_ADMINISTRATIVE_FEE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "PM_VALUE": {
                                 "value": 6000,
                                 "currency": "COP"
                              },
                              "TX_ADMINISTRATIVE_FEE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "TX_NETWORK_VALUE": {
                                 "value": 6000,
                                 "currency": "COP"
                              },
                              "PM_NETWORK_VALUE": {
                                 "value": 6000,
                                 "currency": "COP"
                              },
                              "PM_ADDITIONAL_VALUE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "TX_TAX_RETURN_BASE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "PM_TAX": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "TX_TAX": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "TX_TAX_ADMINISTRATIVE_FEE": {
                                 "value": 0,
                                 "currency": "COP"
                              },
                              "TX_TAX_ADMINISTRATIVE_FEE_RETURN_BASE": {
                                 "value": 0,
                                 "currency": "COP"
                              }
                           },
                           "extraParameters": {
                              "RESPONSE_URL": "http://www.misitioweb.com/respuesta.php",
                              "INSTALLMENTS_NUMBER": "1"
                           }
                        }
                     ],
                     "additionalValues": {
                        "PM_TAX_ADMINISTRATIVE_FEE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "TX_ADDITIONAL_VALUE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "PM_TAX_ADMINISTRATIVE_FEE_RETURN_BASE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "TX_VALUE": {
                           "value": 6000,
                           "currency": "COP"
                        },
                        "PM_ADMINISTRATIVE_FEE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "PM_TAX_RETURN_BASE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "PM_VALUE": {
                           "value": 6000,
                           "currency": "COP"
                        },
                        "TX_ADMINISTRATIVE_FEE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "TX_NETWORK_VALUE": {
                           "value": 6000,
                           "currency": "COP"
                        },
                        "PM_NETWORK_VALUE": {
                           "value": 6000,
                           "currency": "COP"
                        },
                        "PM_ADDITIONAL_VALUE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "TX_TAX_RETURN_BASE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "PM_TAX": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "TX_TAX": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "TX_TAX_ADMINISTRATIVE_FEE": {
                           "value": 0,
                           "currency": "COP"
                        },
                        "TX_TAX_ADMINISTRATIVE_FEE_RETURN_BASE": {
                           "value": 0,
                           "currency": "COP"
                        }
                     }
                  }
               }
            }
         }

         resolve(JSON.stringify(LConsultaPagamento.body));
      }
      catch (error) {
         console.log("Erro ao Verificar Status Boleto", error);
         reject(error);
      }
   });
}

module.exports.ReembolsarPedidoPayUByID = async (req, res, next) => {
   try {
      const { shop, id_usuario, id, valor } = req.body;
      const LRetornoPedido = await transacoes.GetTransacoesByID_IDUsuario(shop, id_usuario, id);

      const LDadosLoja = await integracaoShopify.GetDadosLojaInternal(shop);
      const LDadosGateway = await checkoutsSchema.GetCheckoutAtivoInternal(req, res, next);
      if (LDadosGateway.api_login != undefined && LDadosGateway.gateway == 3) {
         const LFrontEnd = JSON.parse(LRetornoPedido.json_front_end_user_data);
         const LResponseGW = JSON.parse(LRetornoPedido.json_gw_response);
         const LResponseMKTPlace = JSON.parse(LRetornoPedido.json_shopify_response);
         const ItemsRefound = await getItemsRefound(LResponseMKTPlace.order.line_items);
         const ValorRefund = valor || LResponseGW.transaction_details.total_paid_amount;

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
            "test": constantes.CONSTANTE_TESTES

         };
         const Lurl = constantes.API_PAYU;
         //console.log(Lurl);

         utilis.makeAPICallExternalParamsJSON(Lurl, "", LRefund, undefined, undefined, "POST")
            .then(async (resRet) => {

               const LResponse = await funcionalidadesShopify.refoundShopify(LResponseGW, LDadosLoja, ItemsRefound, ValorRefund, 3)
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

   } catch (error) {
      res.json(error);
      res.end();
   }
}
