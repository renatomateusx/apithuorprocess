var express = require('express');
var router = express.Router();
var moment = require("moment");
var schedule = require('node-schedule');
const fulfillments = require('../../schemas/fulfillments');
const logistica = require('../../schemas/logisticas');
const utilisEmail = require('./utilis');
const fs = require('fs');
var vm = require("vm");
const path = require("path");
const constantes = require('../../resources/constantes');
const loja = require('../../schemas/integracaoPlataformas');
const { utils } = require('mocha');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const transacoes = require("../../schemas/transacao");
const utilis = require('../../resources/util');
const checkouts = require('../../schemas/checkouts');
const { unformat } = require('currency-formatter');
//const mpExternal = require('../../public/scripts/mercadopago');


var rules = new schedule.RecurrenceRule();

rules.hour = 0;
rules.minute = 0;
rules.second = 1

var ja = schedule.scheduleJob("* * */16 * * * ", async function () {
    transacoes.GetTransacoesPendentes()
    .then((res)=>{
        const LDada = res;
        LDada.forEach(async (obj, i)=>{
            const idT = obj.id;
            const jsonGW = obj.json_gw_response;
            const jsonFRONT = obj.json_front_end_user_data;
            const id_usuario = obj.id_usuario;
            const gw = obj.gateway;
            const DadosLoja = await loja.GetLojaByUsuario(id_usuario);
            const DadosCheckout = await checkouts.GetCheckoutAtivoInternalOption(id_usuario);
            const LHoje = moment().format('DD-MM-YYYY');
            if(gw == 1){
                //MP
                if(jsonGW.date_of_expiration){
                    const order_id = jsonGW.id;
                    const Expira = moment(jsonGW.date_of_expiration).format("DD-MM-YYYY");
                    if(LHoje > Expira){
                        jsonGW.status = "canceled_expiration";
                        // console.log("Chama API para cancelar MP");
                        url = constantes.END_POINT_CANCELA_BOLETO_API_MP.replace("{ID}", order_id).replace("{TOKEN}", DadosCheckout.token_acesso);
                        utilis.makeAPICallExternalParamsJSON(url, '', {"status":"cancelled"}, undefined, undefined, "PUT")
                        .then((resCancelaBoletoMP)=>{
                            const retorno = JSON.parse(resCancelaBoletoMP.body);
                            if(retorno.status == "canceled" || retorno.status == "404"){
                                transacoes.CancelaBoleto(idT, jsonGW, id_usuario);
                            }
                        })
                    }
                }
            }
            if(gw == 2){
                //PS
                if(jsonGW.payment_method.boleto.due_date){
                    const order_id = jsonGW.id;
                    const Expira = moment(jsonGW.payment_method.boleto.due_date).format("DD-MM-YYYY");
                    if(LHoje > Expira){
                        jsonGW.status = "canceled_expiration";
                        // console.log("Chama API para cancelar PS");
                        // url = constantes.END_POINT_CANCELA_BOLETO_API_MP.replace("{ID}", order_id).replace("{TOKEN}", DadosCheckout.token_acesso);
                        // utilis.makeAPICallExternalParamsJSON(url, '', {"status":"cancelled"}, undefined, undefined, "PUT")
                        // .then((resCancelaBoletoMP)=>{
                            // if(resCancelaBoletoMP.status == "canceled"){
                                transacoes.CancelaBoleto(idT, jsonGW, id_usuario);
                        //     }
                        // })
                    }
                }
            }
            if(gw == 3){
                //PAYU
                if(jsonGW.transactionResponse.extraParameters.EXPIRATION_DATE){
                    const order_id = jsonGW.transactionResponse.orderId;
                    const Expira = moment(jsonGW.transactionResponse.extraParameters.EXPIRATION_DATE).format("DD-MM-YYYY");
                    if(LHoje > Expira){
                        jsonGW.transactionResponse.state = "canceled_expiration";
                        transacoes.CancelaBoleto(idT, jsonGW, id_usuario);
                        // console.log("Chama API para cancelar PayU");
                    }
                }
            }
           

        })
    })


//  console.log('Serviço de Bulk Cancel Boleto Rodando!', moment().format('HH:mm:ss'));












    
});

module.exports = router;