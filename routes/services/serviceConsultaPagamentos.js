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

var j = schedule.scheduleJob('*/30 * * * * *', async function () {
    
    const LIntegracoes = await checkouts.GetIntegracaoCheckoutInternal();
    LIntegracoes.forEach((obj, i)=>{
        processaConsultaMercadoPago();
    });
    console.log('Serviço de Consulta Pagamentos Rodando!', moment().format('HH:mm:ss'));
});

function processaConsultaMercadoPago(){
    try{

    }
    catch(error){
        console.log("Erro ao tentar processar Pagamentos Mercado Pago", error);
    }
}


module.exports = router;