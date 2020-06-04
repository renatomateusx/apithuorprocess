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
const checkoutsPS = require('../../schemas/checkoutPS');
const checkoutPayU = require('../../schemas/checkoutPayU');
const transacoes = require('../../schemas/transacao');
const utilis = require('../../resources/util');
const jp = require('jsonpath');
const funcionalidadesShopify = require('../../resources/funcionalidadesShopify');
const users = require('../../schemas/users');
const planos = require('../../schemas/planos');

var j = schedule.scheduleJob('* * */24 * * *', async function () {

    const LIntegracoes = await checkouts.GetIntegracaoCheckoutInternal();
    LIntegracoes.forEach((obj, i) => {
        if (obj.id == constantes.GATEWAY_MP) {
            processaConsultaMercadoPago();
        }
        if (obj.id == constantes.GATEWAY_PS) {
            processaConsultaPagSeguro();
        }
        if (obj.id == constantes.GATEWAY_PayU) {
            processaConsultaPayU();
        }
    });
    console.log('Serviço de Consulta Pagamentos Rodando!', moment().format('HH:mm:ss'));
});

/**PARA TESTES- APAGUE DEPOIS A FUNÇÃO ABAIXO - PARA RODAR EM MODO TESTE */
// var j = schedule.scheduleJob('*/15 * * * * *', async function () {

//     const LIntegracoes = await checkouts.GetIntegracaoCheckoutInternal();
//     LIntegracoes.forEach((obj, i) => {
//         if (obj.id == constantes.GATEWAY_MP) {
//             processaConsultaMercadoPago();
//         }        
//     });
//     console.log('Serviço TESTE de Consulta Pagamentos Rodando!', moment().format('HH:mm:ss'));
// });
/**PARA TESTES- APAGUE DEPOIS A FUNÇÃO ACIMA */


async function processaConsultaMercadoPago() {
    try {
        const LTransacoes = await transacoes.GetTransacoesPendentesByGatewayINTERNAL(constantes.GATEWAY_MP);
        LTransacoes.forEach(async (objTransaction, i) => {

            const LFrontEnd = objTransaction.json_front_end_user_data;
            const LDadosCheckout = LFrontEnd.dadosCheckout;
            const LBackEnd = objTransaction.json_back_end_payment
            const LDadosGw = objTransaction.json_gw_response;
            const LDadosOrderResponse = objTransaction.json_shopify_response;
            const LVencimentoBoleto = moment(LFrontEnd.dadosComprador.vencimentoBoleto).format();
            const LToday = moment().format();
            if (LToday <= LVencimentoBoleto) {
                //console.log(LDadosOrderResponse);
                if (LDadosGw.status == "pending") {
                    idTransaction = LDadosGw.id;

                    const LConsultaPagamento = await checkouts.CheckStatusBoleto(idTransaction, LDadosCheckout);
                    //console.log(LConsultaPagamento);
                    var LStatus = LConsultaPagamento.status;
                    if (objTransaction.id == 77) LStatus = "APPROVED";
                    if (LStatus.toUpperCase() == "APPROVED") {
                        console.log(objTransaction.id);
                        ///INFORMA AO SHOPIFY E ATUALIZA TABELA.
                        const LTellShopify = await funcionalidadesShopify.tellShopifyPaymentStatus(LFrontEnd.dadosLoja, LFrontEnd.dadosComprador, LDadosOrderResponse, constantes.CONSTANTE_TESTES, LStatus, constantes.GATEWAY_MP, objTransaction.id);
                        const LDataProcess = moment().format();
                        const UsuarioDado = await users.GetUserByIDInternal(LFrontEnd.dadosLoja.id_usuario);
                        const LPlano = await planos.GetUserByIDInternalByID(UsuarioDado.plano);
                        var LPercentComission = LPlano.json.addon.replace("%", "");
                        LPercentComission = parseFloat(LPercentComission);
                        const LValCom = (parseFloat(LPercentComission) / 100) * parseFloat(LFrontEnd.dadosComprador.valor);
                        LValorComissao = parseFloat(LValCom);
                        const InsereTransacaoInterna = await transacoes.insereTransacaoInterna(LDataProcess, UsuarioDado.proximo_pagamento, UsuarioDado.id, UsuarioDado.plano, LFrontEnd.dadosLoja.url_loja, LFrontEnd, LBackEnd, LDadosGw, 'PENDING', LValorComissao, constantes.GATEWAY_MP);
                        console.log(LTellShopify);
                        console.log(InsereTransacaoInterna);
                    }

                }
            }
            //console.log(LTransacoes);
        })

    }
    catch (error) {
        console.log("Erro ao tentar processar Pagamentos Mercado Pago", error);
    }
}

async function processaConsultaPagSeguro() {
    try {
        const LTransacoes = await transacoes.GetTransacoesPendentesByGatewayINTERNAL(constantes.GATEWAY_PS);
        LTransacoes.forEach(async (objTransaction, i) => {

            const LFrontEnd = objTransaction.json_front_end_user_data;
            const LDadosCheckout = LFrontEnd.dadosCheckout;
            const LBackEnd = objTransaction.json_back_end_payment
            const LDadosGw = objTransaction.json_gw_response;
            const LDadosOrderResponse = objTransaction.json_shopify_response;
            const LVencimentoBoleto = moment(LFrontEnd.dadosComprador.vencimentoBoleto).format();
            const LToday = moment().format();
            if (LToday <= LVencimentoBoleto) {
                //console.log(LDadosOrderResponse);
                if (LDadosGw.status.toUpperCase() == "WAITING") {
                    idTransaction = LDadosGw.id;

                    //const URL = constantes.API_MP.replace("{id}", idTransaction).replace("{token}", LDadosCheckout.token_acesso);
                    var LConsultaPagamento = await checkoutsPS.CheckStatusBoleto(idTransaction, LDadosCheckout);
                    var LConsultaPagamento = JSON.parse(LConsultaPagamento);
                    //console.log(LConsultaPagamento);
                    var LStatus = LConsultaPagamento.status;
                    // if (objTransaction.id == 70) LStatus = "APPROVED";
                    if (LStatus.toUpperCase() == "APPROVED" || LStatus.toUpperCase() == "AUTHORIZED") {
                        ///INFORMA AO SHOPIFY E ATUALIZA TABELA.
                        const LTellShopify = await funcionalidadesShopify.tellShopifyPaymentStatus(LFrontEnd.dadosLoja, LFrontEnd.dadosComprador, LDadosOrderResponse, constantes.CONSTANTE_TESTES, LStatus, constantes.GATEWAY_PS, objTransaction.id);
                        const LDataProcess = moment().format();
                        const UsuarioDado = await users.GetUserByIDInternal(LFrontEnd.dadosLoja.id_usuario);
                        const LPlano = await planos.GetUserByIDInternalByID(UsuarioDado.plano);
                        var LPercentComission = LPlano.json.addon.replace("%", "");
                        LPercentComission = parseFloat(LPercentComission);
                        const LValCom = (parseFloat(LPercentComission) / 100) * parseFloat(LFrontEnd.dadosComprador.valor);
                        LValorComissao = parseFloat(LValCom);
                        const InsereTransacaoInterna = await transacoes.insereTransacaoInterna(LDataProcess, UsuarioDado.proximo_pagamento, UsuarioDado.id, UsuarioDado.plano, LFrontEnd.dadosLoja.url_loja, LFrontEnd, LBackEnd, LDadosGw, 'PENDING', LValorComissao, constantes.GATEWAY_PS);
                    }

                }
            }
            //console.log(LTransacoes);
        })

    }
    catch (error) {
        console.log("Erro ao tentar processar Pagamentos Mercado Pago", error);
    }
}

async function processaConsultaPayU() {
    try {
        const LTransacoes = await transacoes.GetTransacoesPendentesByGatewayINTERNAL(constantes.GATEWAY_PayU);
        LTransacoes.forEach(async (objTransaction, i) => {

            const LFrontEnd = objTransaction.json_front_end_user_data;
            const LBackEnd = objTransaction.json_back_end_payment
            const LDadosCheckout = LFrontEnd.dadosCheckout;
            const LDadosGw = objTransaction.json_gw_response;
            const LDadosOrderResponse = objTransaction.json_shopify_response;
            //console.log(LDadosGw);
            if (LDadosGw.transactionResponse.state.toUpperCase() == "PENDING") {
                idTransaction = LDadosGw.transactionResponse.orderId;

                //const URL = constantes.API_MP.replace("{id}", idTransaction).replace("{token}", LDadosCheckout.token_acesso);
                var LConsultaPagamento = await checkoutPayU.CheckStatusBoleto(idTransaction, LDadosCheckout);
                var LConsultaPagamento = JSON.parse(LConsultaPagamento);
                //console.log(LConsultaPagamento);
                const LVencimentoBoleto = moment(LFrontEnd.dadosComprador.vencimentoBoleto).format();
                const LToday = moment().format();
                if (LToday <= LVencimentoBoleto) {
                    var LStatus = LConsultaPagamento.result.payload.status;
                    //if (objTransaction.id == 75) LStatus = "APPROVED";
                    if (LStatus.toUpperCase() == "APPROVED" || LStatus.toUpperCase() == "AUTHORIZED") {
                        ///INFORMA AO SHOPIFY E ATUALIZA TABELA.
                        const LTellShopify = await funcionalidadesShopify.tellShopifyPaymentStatus(LFrontEnd.dadosLoja, LFrontEnd.dadosComprador, LDadosOrderResponse, constantes.CONSTANTE_TESTES, 'paid', constantes.GATEWAY_PayU, objTransaction.id);
                        const LDataProcess = moment().format();
                        const UsuarioDado = await users.GetUserByIDInternal(LFrontEnd.dadosLoja.id_usuario);
                        const LPlano = await planos.GetUserByIDInternalByID(UsuarioDado.plano);
                        var LPercentComission = LPlano.json.addon.replace("%", "");
                        LPercentComission = parseFloat(LPercentComission);
                        const LValCom = (parseFloat(LPercentComission) / 100) * parseFloat(LFrontEnd.dadosComprador.valor);
                        LValorComissao = parseFloat(LValCom);
                        const InsereTransacaoInterna = await transacoes.insereTransacaoInterna(LDataProcess, UsuarioDado.proximo_pagamento, UsuarioDado.id, UsuarioDado.plano, LFrontEnd.dadosLoja.url_loja, LFrontEnd, LBackEnd, LDadosGw, 'PENDING', LValorComissao, constantes.GATEWAY_PayU);

                    }
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