var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');
const clientes = require('./clientes');
const funcionalidadesShpify = require('../resources/funcionalidadesShopify');


module.exports.DoPay = (req, res, next) => {
    try {
        const { pay } = req.body;
        console.log("Pay", pay);

        mercadopago.configurations.setAccessToken(constantes.SAND_BOX_MP_ACCESS_TOKEN);
        var paymentData = {
            transaction_amount: parseFloat(LJSON.paymentData.transaction_amount),
            token: LJSON.paymentData.token,
            description: LJSON.paymentData.description,
            installments: parseInt(LJSON.paymentData.installments),
            payment_method_id: LJSON.paymentData.payment_method_id,
            payer: LJSON.paymentData.payer
        }
        console.log("paymentData", paymentData);
        mercadopago.payment.save(paymentData)
            .then(async function (data) {
                const DataResponse = data.response;
                ///console.log(data.response);
                if (data.response.status == 'approved') {
                    LJSON.dadosComprador.data = data.response.date_created;
                    LJSON.dadosComprador.id_transacao = data.response.id;
                    LJSON.dadosComprador.valorParcela = data.response.transaction_details.installment_amount;
                    var responseShopify = await funcionalidadesShpify.enviaOrdemShopify(LJSON, DataResponse, paymentData, data.response.status, constantes.GATEWAY_MP);
                    var plataformasResponse = {
                        shopify: responseShopify,
                        woo: 'notYet',
                    }
                    res.status(200).send(responseShopify);
                }
                else {
                    console.log("Response", data.response);
                    res.status(422).send("Pagamento não realizado, tente novamente");
                }

            }).catch(function (error) {
                console.log("Erro MP", error);
                if (error.cause != undefined) {
                    console.log(error.cause[0].code);
                    res.status(422).send(error.cause[0].code);
                }
                else {
                    res.status(422).send("Pagamento não realizado, tente novamente");
                }
            });


    } catch (error) {
        res.json(error);
        res.end();
    }
}
