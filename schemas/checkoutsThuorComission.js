var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
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
        const URL = constantes.API_MP_PAYMENT.replace('{token}', LJSON.dadosCheckout.token_acesso)
        utilis.makeAPICallExternalParamsJSON(URL, '', paymentData, undefined, undefined, 'POST')
            .then(async function (data) {
                const DataResponse = JSON.parse(data.body);
                ///console.log(data.response);
                if (DataResponse.status == 'approved') {
                    pay.data = DataResponse.date_created;
                    pay.id_transacao = DataResponse.id;
                    pay.valorParcela = DataResponse.transaction_details.installment_amount;
                    res.status(200).send(DataResponse);
                }
                else {
                    console.log("Response", DataResponse);
                    res.status(200).send(DataResponse);
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
        res.status(422).send(error);
        res.end();
    }
}
