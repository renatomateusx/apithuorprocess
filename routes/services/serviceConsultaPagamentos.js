var express = require('express');
var router = express.Router();
var moment = require("moment");
const http = require('http');
var schedule = require('node-schedule');
const fulfillments = require('../../schemas/fulfillments');
const logistica = require('../../schemas/logisticas');
const utilisEmail = require('./utilis');
const fs = require('fs');
const path = require("path");
const constantes = require('../../resources/constantes');
const loja = require('../../schemas/integracaoPlataformas');
const checkouts = require('../../schemas/checkouts');
const transacoes = require('../../schemas/transacao');
const utilis = require('../../resources/util');
const jp = require('jsonpath');
const funcionalidadesShopify = require('../../resources/funcionalidadesShopify');

var j = schedule.scheduleJob('*/15 * * * * *', async function () {

    const LIntegracoes = await checkouts.GetIntegracaoCheckoutInternal();
    LIntegracoes.forEach((obj, i) => {
        if (obj.id == constantes.GATEWAY_MP) {
            processaConsultaMercadoPago();
        }
    });
    console.log('Serviço de Consulta Pagamentos Rodando!', moment().format('HH:mm:ss'));
});

async function processaConsultaMercadoPago() {
    try {
        const LTransacoes = await transacoes.GetTransacoesPendentesByGatewayINTERNAL(constantes.GATEWAY_MP);
        LTransacoes.forEach(async (objTransaction, i) => {

            const LFrontEnd = objTransaction.json_front_end_user_data;
            const LDadosCheckout = LFrontEnd.dadosCheckout;
            const LDadosGw = objTransaction.json_gw_response;
            const LDadosOrderResponse = objTransaction.json_shopify_response;
            //console.log(LDadosOrderResponse);
            if (LDadosGw.status == "pending") {
                idTransaction = LDadosGw.id;

                const URL = constantes.API_MP.replace("{id}", idTransaction).replace("{token}", LDadosCheckout.token_acesso);
                const LConsultaPagamento = await utilis.makeAPICallExternal(URL);
                var LStatus = LConsultaPagamento.status;
                if (LStatus == "approved") {
                    ///INFORMA AO SHOPIFY E ATUALIZA TABELA.
                    const LTellShopify = await funcionalidadesShopify.tellShopifyPaymentStatus(LFrontEnd.dadosLoja, LFrontEnd.dadosComprador, LDadosOrderResponse, true, LStatus, constantes.GATEWAY_MP, objTransaction.id);
                }

            }
            //console.log(LTransacoes);
        })

    }
    catch (error) {
        console.log("Erro ao tentar processar Pagamentos Mercado Pago", error);
    }
}


module.exports = router;