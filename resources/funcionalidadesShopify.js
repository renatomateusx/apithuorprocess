const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('../schemas/transacao');
const clientes = require('../schemas/clientes');
const users = require('../schemas/users');
const moment = require('moment');
const planos = require('../schemas/planos');

module.exports.enviaOrdemShopify = (LJSON, data, paymentData, status, gatewayP) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log("Ldata", LJSON.dadosLoja);
            //ADICIONADO PARA PAREPARAR A PLATAFORMA PARA RECEBER OUTRAS INTEGRAÇÕES. WOOCOMMERCE, POR EXEMPLO
            const LHaveShopifyProducts = LJSON.produtos.filter(x => x.plataforma == constantes.PLATAFORMA_SHOPIFY);
            if (LHaveShopifyProducts) {

                const LShopifyOrder = await module.exports.mountJSONShopifyOrder(LJSON, status);
                const ordersShopify = format("/admin/api/{}/{}.json", constantes.VERSAO_API, constantes.RESOURCE_ORDERS);
                const urlShopify = format("https://{}:{}@{}", LJSON.dadosLoja.chave_api_key, LJSON.dadosLoja.senha, LJSON.dadosLoja.url_loja);
                var headerAditional = "X-Shopify-Access-Token";
                var valueHeaderAditional = LJSON.dadosLoja.senha;
                utilis.makeAPICallExternalParamsJSON(urlShopify, ordersShopify, LShopifyOrder, headerAditional, valueHeaderAditional, 'POST')
                    .then(async retornoShopify => {
                        const RetornoShopifyJSON = retornoShopify.body;
                        transacoes.insereTransacao(LJSON.dadosLoja.id_usuario, LJSON.dadosLoja.url_loja, LJSON, paymentData, data, LShopifyOrder, retornoShopify.body, status.toUpperCase(), gatewayP, LJSON.dadosComprador.ttrack)
                            .then(async (retornoInsereTransacao) => {
                                const IDTr = retornoInsereTransacao;
                                const LDataProcess = moment().format();
                                const UsuarioDado = await users.GetUserByIDInternal(LJSON.dadosLoja.id_usuario);
                                const LComissaoValue = 0.00;
                                if (status == 'paid') {
                                    const LPlano = await planos.GetUserByIDInternalByID(UsuarioDado.plano);
                                    var LPercentComission = LPlano.json.addon.replace("%", "");
                                    LPercentComission = parseFloat(LPercentComission);
                                    const LValCom = (parseFloat(LPercentComission) / 100) * parseFloat(LJSON.dadosComprador.valor);
                                    LValorComissao = parseFloat(LValCom);
                                    const InsereTransacaoInterna = await transacoes.insereTransacaoInterna(IDTr, LDataProcess, UsuarioDado.proximo_pagamento, UsuarioDado.id, UsuarioDado.plano, LJSON.dadosLoja.url_loja, LJSON, paymentData, data, 'PENDING', LValorComissao, gatewayP);
                                }
                                const LUpdate = await clientes.UpdateLead(LJSON.dadosComprador.email, LJSON.produtos);
                                LJSON.dadosComprador.ordem_id = RetornoShopifyJSON;
                                const response = {
                                    dataGateway: data,
                                    dataStore: RetornoShopifyJSON,
                                    dadosComprador: LJSON
                                }
                                resolve(response);
                            })
                            .catch((error) => {
                                console.log("Erro ao inserir transação no banco", error);
                            })
                    })
                    .catch(error => {
                        console.log("Erro ao enviar informação do checkout para a shopify", error);
                    })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}



module.exports.mountJSONShopifyOrder = (Pjson, situacao) => {
    return new Promise(async (resolve, reject) => {
        try {
            const LProd = Pjson.produtos.filter(x => x.plataforma == constantes.PLATAFORMA_SHOPIFY);
            const LShopifyOrder = {
                "order": {
                    "line_items": LProd,
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


module.exports.tellShopifyPaymentStatus = (PdadosLoja, PdadosComprador, PshopifyOrder, teste, status, gateway) => {
    return new Promise((resolve, reject) => {
        try {

            const updateStatusOrdersShopify = format("/admin/api/{}/orders/{}/{}.json", constantes.VERSAO_API, PshopifyOrder.order.id, constantes.RESOURCE_TRANSACTIONS);
            const urlShopify = format("https://{}:{}@{}", PdadosLoja.chave_api_key, PdadosLoja.senha, PdadosLoja.url_loja);
            var headerAditional = "X-Shopify-Access-Token";
            var valueHeaderAditional = PdadosLoja.senha;
            //console.log(urlShopify, updateStatusOrdersShopify);
            utilis.makeAPICallExternal(urlShopify + updateStatusOrdersShopify)
                .then((resTransactions) => {
                    var LTransaction = resTransactions.transactions.filter(x => parseFloat(x.amount) == parseFloat(PdadosComprador.valor));
                    var LTransaction = LTransaction[0];
                    if (LTransaction && LTransaction.kind == "authorization") {
                        var LPaymentStatus = {
                            "transaction": {
                                "currency": "BRL",
                                "amount": parseFloat(PdadosComprador.valor),
                                "kind": "capture",
                                "parent_id": LTransaction.id,
                                "test": teste,
                                "gateway": gateway
                            }
                        }
                        utilis.makeAPICallExternalParamsJSON(urlShopify, updateStatusOrdersShopify, LPaymentStatus, headerAditional, valueHeaderAditional, 'POST')
                            .then(async retornoShopify => {
                                const RetornoShopifyJSON = retornoShopify.body;
                                transacoes.UpdateTransacaoShopifyOrderStatus(PshopifyOrder.order.id, PshopifyOrder, status.toUpperCase())
                                    .then((retornoUpdateTransacao) => {
                                        const response = retornoUpdateTransacao;
                                        resolve(response);
                                    })
                                    .catch((error) => {
                                        console.log("Erro ao inserir transação no banco", error);
                                    })
                            })
                            .catch(error => {
                                console.log("Erro ao enviar informação do checkout para a shopify", error);
                            })
                    }

                })
                .catch((error) => {
                    console.log("Erro ao Obter dados da transação", error);
                })

        }
        catch (error) {
            console.log("Erro ao informar o status do pagamento de boleto aprovado ao shopify", error);
            reject(error);
        }
    })

}

module.exports.refoundShopify = (JSON, LDadosLoja, ItemsRefound, ValorRefund, GW, IDTr) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                            "gateway": GW
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
                    transacoes.updateTransacao(id_usuario, LDadosLoja.url_loja, GW, 'REEMBOLSADA')
                        .then(async (retornoInsereTransacao) => {
                            const LDevole = await transacoes.DevolveComissao(IDTr, id_usuario, LDadosLoja.url_loja, ValorRefund);
                            const response = {
                                dataGateway: GW,
                                dataStore: RetornoShopifyJSON
                            }
                            resolve(response);
                        })
                        .catch((error) => {
                            console.log("Erro ao inserir transação no banco", error);
                        })
                })
                .catch(error => {
                    console.log("Erro ao enviar informação do checkout para a shopify", error);
                })

        }
        catch (error) {
            reject(error);
        }
    });
}
