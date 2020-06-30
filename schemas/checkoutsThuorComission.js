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
        pay.capture = false;
        const URL = constantes.API_MP_PAYMENT.replace('{token}', constantes.PRODUCAO_BOX_MP_ACCESS_TOKEN);
        utilis.makeAPICallExternalParamsJSON(URL, '', pay, undefined, undefined, 'POST')
            .then(async function (data) {
                const DataResponse = JSON.parse(data.body);
                if (DataResponse.status == constantes.CONSTANTE_APPROVED_MP) {
                    const URL_CONSULTA = constantes.API_MP.replace('{id}', DataResponse.id).replace('{token}', constantes.PRODUCAO_BOX_MP_ACCESS_TOKEN);
                    const Wait = await module.exports.Wait(3000);
                    const LRetornoConsulta = await module.exports.GetStatusFromOrder(URL_CONSULTA);
                    if (LRetornoConsulta.status != undefined) {
                        if (LRetornoConsulta.status == constantes.CONSTANTE_APPROVED_MP) {
                            pay.data = DataResponse.date_created;
                            pay.id_transacao = DataResponse.id;
                            pay.valorParcela = DataResponse.transaction_details.installment_amount;
                            res.status(200).send(DataResponse);
                        }
                        else {
                            res.status(422).send('Não aprovada');
                        }
                    } else {
                        res.status(422).send('Não aprovada');
                    }
                }
                else {
                    console.log("Response", DataResponse);
                    res.status(422).send('Não Aprovada');
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

module.exports.Wait = (seconds) => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(function () {
                resolve(1);
            }, seconds);
        }
        catch (error) {
            reject(error);
        }
    })
}

module.exports.GetStatusFromOrder = (URL) => {
    return new Promise((resolve, reject) => {
        try {
            utilis.makeAPICallExternalParamsJSON(URL, '', '', undefined, undefined, 'GET')
                .then(async function (data) {
                    const DataResponse = JSON.parse(data.body);
                    resolve(DataResponse);
                })
                .catch((error) => {
                    console.log("Erro", error);
                })
        }
        catch (error) {
            reject(error);
        }
    });
}