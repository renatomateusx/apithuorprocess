var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');
const clientes = require('../schemas/clientes');
const funcionalidadesShopify = require('../resources/funcionalidadesShopify');

module.exports.StartSessionPS = (req, res, next) => {

    try {
        const { email, token } = req.body;
        var LParams = "email=" + email;
        LParams = LParams + "&token=" + token;
        const Lurl = "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=" + email + "&token=" + token + "";
        console.log(Lurl);
        utilis.makeAPICallExternalParamsPS(Lurl)
            .then(async (resRet) => {
                console.log(resRet);
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
        const Lurl = constantes.API_PS.replace("{}", 'public-keys');
        console.log(LParams);
        utilis.makeAPICallExternalParamsJSON(Lurl, "", LBody, "Authorization", "Bearer " + token, "POST")
            .then(async (resRet) => {

                //const LRetJson = xmlParser.xml2json(resRet, {compact: true});
                //const LIDSession = JSON.parse(LRetJson).session.id._text;
                //console.log("LID", JSON.parse(resRet.body).public_key);
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
        const Lurl = constantes.API_PS.replace("{}", 'charges');
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
        ///console.log(LJSON.paymentData);
        utilis.makeAPICallExternalParamsJSONHeadersArray(Lurl, "", LJSON.paymentData, LHeaderKey, LHeaderValue, "POST")
            .then(async (resRet) => {
                const Body = JSON.parse(resRet.body);
                console.log("LID", Body);
                if (resRet.body.indexOf('error_messages') > -1) {
                    res.status(422).send(Body);
                    res.end();
                    return;
                }

                if (Body.status.toUpperCase() == 'PAID') {
                    LJSON.dadosComprador.data = Body.created_at;
                    LJSON.dadosComprador.valor = parseFloat(Body.amount.summary.paid.replace(',','.'));
                    LJSON.dadosComprador.id_transacao = Body.id;
                    LJSON.dadosComprador.valorParcela = (parseFloat(Body.amount.summary.paid.replace(',','.')) / Body.payment_method.installments);
                    var responseShopify = await funcionalidadesShopify.enviaOrdemShopify(LJSON, Body, LJSON.paymentData, 'paid', constantes.GATEWAY_PS);
                    var plataformasResponse = {
                        shopify: responseShopify,
                        woo: 'notYet',
                    }
                    res.status(200).send(responseShopify);
                }
                else if (Body.status.toUpperCase() == 'WAITING') {
                    LJSON.dadosComprador.barcode = Body.payment_method.boleto.formatted_barcode;
                    LJSON.dadosComprador.urlBoleto = Body.links.find(x => x.media == 'application/pdf').href;
                    LJSON.dadosComprador.vencimentoBoleto = Body.payment_method.boleto.due_date;
                    LJSON.dadosComprador.data = Body.created_at;
                    LJSON.dadosComprador.id_transacao = Body.id;

                    var responseShopify = await funcionalidadesShopify.enviaOrdemShopify(LJSON, Body, LJSON.paymentData, 'pending', constantes.GATEWAY_PS);
                    var plataformasResponse = {
                        shopify: responseShopify,
                        woo: 'notYet',
                    }
                    const LDadosComprador = responseShopify.dadosComprador.dadosComprador;
                    const LDadosLoja = responseShopify.dadosComprador.dadosLoja;
                    utilisM.SendEmailBoletoInternal(LDadosComprador, LDadosLoja);
                    //console.log(responseShopify);
                    res.status(200).send(responseShopify);

                }
                else {
                    console.log("Response", Body);
                    res.status(422).send("Pagamento não realizado, tente novamente");
                }
                //res.status(200).send(JSON.parse(resRet.body).public_key);
                //res.end();
            })
            .catch((error) => {
                console.log("Error", error);
                res.status(422).send("Pagamento não realizado, tente novamente");
                res.end();
            })
    } catch (error) {
        res.json(error);
        res.end();
    }

}

module.exports.ReembolsarPedidoPSByID = async (req, res, next) => {
    try {
        const { shop, id_usuario, id, valor } = req.body;
        const LRetornoPedido = await transacoes.GetTransacoesByID_IDUsuario(shop, id_usuario, id);

        const LDadosLoja = await integracaoShopify.GetDadosLojaInternal(shop);
        const LDadosGateway = await checkoutsSchema.GetCheckoutAtivoInternal(req, res, next);
        if (LDadosGateway.token_acesso != undefined && LDadosGateway.gateway == 2) {
            const LResponseGW = JSON.parse(LRetornoPedido.json_gw_response);
            const LResponseMKTPlace = JSON.parse(LRetornoPedido.json_shopify_response);
            const ItemsRefound = await getItemsRefound(LResponseMKTPlace.order.line_items);
            const ValorRefund = valor || LResponseGW.transaction_details.total_paid_amount;

            var LRefund = {
                "amount": {
                    "value": ValorRefund
                }
            };
            const Lurl = constantes.API_PS.replace("{}", LResponseGW.id + "/cancel");;
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
                    const LResponse = await funcionalidadesShopify.refoundShopify(LResponseGW, LDadosLoja, ItemsRefound, ValorRefund, 2)
                    res.status(200).send(LResponse);


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

module.exports.PublicKeyInternal = (type, token) => {
    return new Promise((resolve, reject) => {
        try {
            const { type, token } = req.body;
            var LBody = {
                "type": type
            }
            var LParams = "email=" + type;
            LParams = LParams + "&token=" + token;
            const Lurl = constantes.API_PS.replace("{}", 'public-keys');
            console.log(LParams);
            utilis.makeAPICallExternalParamsJSON(Lurl, "", LBody, "Authorization", "Bearer " + token, "POST")
                .then(async (resRet) => {

                    //const LRetJson = xmlParser.xml2json(resRet, {compact: true});
                    //const LIDSession = JSON.parse(LRetJson).session.id._text;
                    //console.log("LID", JSON.parse(resRet.body).public_key);
                    resolve(JSON.parse(resRet.body).public_key);
                })
                .catch((error) => {
                    console.log("Error", error);
                    reject(error);
                })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.CheckStatusBoleto = (idTransaction, LDadosCheckout) => {
    return new Promise(async (resolve, reject) => {
        try {
            var LHeaderKey = [];
            var LHeaderValue = [];
            LHeaderKey.push('Authorization');
            LHeaderValue.push('Bearer ' + LDadosCheckout.token_acesso);
            LHeaderKey.push('X-api-version');
            LHeaderValue.push('1.0');
            LHeaderKey.push('X-idempotency-key');
            LHeaderValue.push('');

            const URL = constantes.API_PS.replace("{}", "charges/" + idTransaction);
            //console.log(URL);
            const LConsultaPagamento = await utilis.makeAPICallExternalHeadersCustom(URL, LHeaderKey, LHeaderValue);
            resolve(LConsultaPagamento);
        }
        catch (error) {
            console.log("Erro ao Verificar Status Boleto", error);
            reject(error);
        }
    });
}