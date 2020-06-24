var express = require('express');
var router = express.Router();
var moment = require("moment");
var schedule = require('node-schedule');
const fulfillments = require('../../schemas/fulfillments');
const logistica = require('../../schemas/logisticas');
const utilisEmail = require('../../routes/services/utilis');
const fs = require('fs');
var vm = require("vm");
const path = require("path");
const constantes = require('../../resources/constantes');
const loja = require('../../schemas/integracaoPlataformas');
const { utils } = require('mocha');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
//const mpExternal = require('../../public/scripts/mercadopago');



var rule = new schedule.RecurrenceRule();
rule.hour = 23;
rule.minute = 0;


// var j = schedule.scheduleJob(rule, function () {
//     fulfillments.GetFulFillmentList()
//         .then((resFul) => {
//             resFul.forEach(async (obj, i) => {
//                 const awa = await utilisEmail.sleep(1000);
//                 const order_id = obj.order_id;
//                 const id_usuario = obj.id_usuario;
//                 const id = obj.id;
//                 const fulfillment_id = obj.fulfillment_id;
//                 const email = obj.email;
//                 const telefone = obj.telefone;
//                 const tracking_number = obj.json_shipments.tracking_number;
//                 var last_updated = "";
//                 const actualDate = moment().format();
//                 last_updated = moment(obj.last_updated).format();
//                 const diff = moment(actualDate).diff(last_updated);
//                 const duration = moment.duration(diff);
//                 var LDescriptionCheckPoint = "";
//                 var LDateCheckPoint = "";
//                 var LStatusCheckPoint = "";
//                 var LDetailCheckPoint = "";
//                 var self = this;
//                 const DadosLoja = await loja.GetLojaByUsuario(id_usuario);
//                 var LSIT = " está chegando!";
//                 //console.log('diff', duration.asHours());
//                 if (duration.asHours() >= 24) {

//                     //console.log('diff', duration.asHours());
//                     console.log(tracking_number);

//                     var LReturnTracker = await logistica.TrackingCodeInternal(tracking_number);
//                     console.log(LReturnTracker);
//                     if (LReturnTracker && LReturnTracker.length > 20) {
//                         LReturnTracker = JSON.parse(LReturnTracker);
//                         //console.log(tracking_number);   
//                         // console.log("Retorno", LReturnTracker);
//                         if (LReturnTracker) {
//                             LReturnTracker.forEach(async (objTrack, i) => {
//                                 objTrack.checkpoints.forEach(async (objCheckPoint, i) => {
//                                     self.LDescriptionCheckPoint = objCheckPoint.description + ' - ' || '';
//                                     self.LDateCheckPoint = moment(objCheckPoint.date).format("DD/MM/YYYY HH:mm:ss");
//                                     self.LStatusCheckPoint = await utilisEmail.getStatusRastreio(self.LStatusCheckPoint, objCheckPoint.status);
//                                     self.LDetailCheckPoint = await utilisEmail.getDetail(self.LDateCheckPoint, objCheckPoint.details);
//                                     if (objCheckPoint.status == "DELIVERED") {
//                                         LSIT = " foi ENTREGUE!";
//                                     } else {
//                                         LSIT = " está chegando";
//                                     }
//                                 });
//                                 var LSTATUS = constantes.STRING_STATUS_EMAIL;
//                                 LSTATUS = LSTATUS.replace("{STATUS}", self.LStatusCheckPoint || '');
//                                 LSTATUS = LSTATUS.replace("{LOCAL}", self.LDescriptionCheckPoint || '');
//                                 LSTATUS = LSTATUS.replace("{LOCAL_CIDADE}", self.LDetailCheckPoint || '');
//                                 LSTATUS = LSTATUS.replace("{DATA}", self.LDateCheckPoint);
//                                 //console.log("STATUS", LSTATUS);

//                                 const LUpdateTracker = moment(objTrack.lastUpdateTime).format("DD/MM/YYYY hh:mm:ss");
//                                 //console.log("Upate", LUpdateTracker);
//                                 if (LUpdateTracker > moment(last_updated).format("DD/MM/YYYY hh:mm:ss")) {
//                                     console.log(LUpdateTracker, last_updated);
//                                     const statusTracker = objTrack.status;
//                                     var template = path.resolve('public/templates/email-encomenda.html');
//                                     fs.readFile(template, 'utf8', async function (err, html) {
//                                         if (err) {
//                                             throw err;
//                                         }
//                                         var LHTML = html;
//                                         var URLTrack = constantes.URL_TRACK_CODE.replace('@', tracking_number);
//                                         //console.log(URLTrack);
//                                         LHTML = LHTML.replace("{URL_RASTREIO}", URLTrack);
//                                         LHTML = LHTML.replace("@SATUS_ENCOMENDA", LSTATUS);
//                                         LHTML = LHTML.replace("@NOME_LOJA", DadosLoja.nome_loja);
//                                         LHTML = LHTML.replace("@SIT", LSIT);
//                                         //console.log(LHTML);
//                                         var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailRastreio);
//                                         arrayAttachments.forEach((obj, i) => {
//                                             obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
//                                         });

//                                         const LReturnEmail = await utilisEmail.SendMail(email, constantes.STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO, LHTML, arrayAttachments);
//                                         if (LReturnEmail) {
//                                             const updateFulFillment = await fulfillments.UpdateStatusFulFillmentInternal(id_usuario, id, statusTracker, moment().format());
//                                             if (updateFulFillment) {
//                                             }
//                                             else {
//                                                 console.log("Error", updateFulFillment);
//                                             }
//                                         }
//                                     });

//                                 }
//                             })
//                         }
//                     }
//                 }
//                 var LDataProximo = moment()
//                     .add({ days: 2 })
//                     .format();
//                 const LUpdateProximoPagamento = await fulfillments.UpdateStatusFulFillmentInternalProximaConsulta(id_usuario, id, LDataProximo);
//             });
//         })
//         .catch((error) => {
//             console.log("Erro ao pegar o fulfillment", error);
//         })
//     console.log('Serviço de Shipment Rodando!', moment().format('HH:mm:ss'));
// });

var rules = new schedule.RecurrenceRule();

rules.hour = 0;
rules.minute = 0;
rules.second = 1

var ja = schedule.scheduleJob("* * */23 * * * ", async function () {
    fulfillments.GetFulFillmentList()
    .then((resFul) => {
        resFul.forEach(async (obj, i) => {
            // const awa = await utilisEmail.sleep(1000);
            const order_id = obj.order_id;
            const id_usuario = obj.id_usuario;
            const id = obj.id;
            const fulfillment_id = obj.fulfillment_id;
            const email = obj.email;
            const statusText = obj.status_text ||'';
            const telefone = obj.telefone;
            const tracking_number = obj.json_shipments.tracking_number;
            var last_updated = "";
            const actualDate = moment().format();
            last_updated = moment(obj.last_updated).format();
            const diff = moment(actualDate).diff(last_updated);
            const duration = moment.duration(diff);
            var LDescriptionCheckPoint = "";
            var LDateCheckPoint = "";
            var LStatusCheckPoint = "";
            var LDetailCheckPoint = "";
            var self = this;
            const DadosLoja = await loja.GetLojaByUsuario(id_usuario);
            var LSIT = " está chegando!";
            var statusShip = 'PENDING';
            var LSubject = constantes.STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO;
            //console.log('diff', duration.asHours());
            if (duration.asHours() >= 24) {

                //console.log('diff', duration.asHours());
                // console.log(tracking_number);
                const LReturn = await logistica.TrackingCodeInternalNinja(tracking_number);
                const dom = new JSDOM(LReturn);
                const item = dom.window.document.getElementsByClassName("year")[0].textContent;
                var itemDate = item.split('/');
                var dateFinal = itemDate[0] + '-' + itemDate[1] + '-'+ '20'+itemDate[2];
                if (item.length > 5) {
                    const ItemDiv = dom.window.document.getElementsByClassName("item")[0];
                    const itemStatus = dom.window.document.getElementsByTagName("li");
                    const status = itemStatus[2].innerHTML;
                    if(status && status.length > 1){
                        if(statusText != status){
                            if (status.includes("entregue")) {
                                LSIT = " foi ENTREGUE!";
                                statusShip = "DELIVERED"
                                LSubject = constantes.STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO_ENTREGUE;
                            } else {
                                LSIT = " está chegando";
                                statusShip = "PENDING";
                                LSubject = constantes.STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO;
                            }
                            //
                            const LUpdateTracker = moment(dateFinal, 'DD-MM-YYYY').format();
                            console.log('lup', LUpdateTracker);
                            console.log('lst',moment(last_updated, 'YYYY-MM-DD').format());
                            if (LUpdateTracker > moment(last_updated, 'YYYY-MM-DD').format()) {
                                console.log(LUpdateTracker, last_updated);
                                const statusTracker = status;
                                
                                var template = path.resolve('public/templates/email-encomenda.html');
                                fs.readFile(template, 'utf8', async function (err, html) {
                                    if (err) {
                                        throw err;
                                    }
                                    var LHTML = html;
                                    var URLTrack = constantes.URL_TRACK_CODE.replace('@', tracking_number);
                                    //console.log(URLTrack);
                                    LHTML = LHTML.replace("{URL_RASTREIO}", URLTrack);                                   
                                    LHTML = LHTML.replace("@SATUS_ENCOMENDA", statusTracker);
                                    LHTML = LHTML.replace("@NOME_LOJA", DadosLoja.nome_loja);
                                    LHTML = LHTML.replace("@SIT", LSIT);
                                    LHTML = LHTML.replace("@HTML_RASTREIO", ItemDiv.innerHTML);
                                    //console.log(LHTML);
                                    var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailRastreio);
                                    arrayAttachments.forEach((obj, i) => {
                                        obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                                    });
                                    console.log("Vou enviar EMail");
                                    const LReturnEmail = await utilisEmail.SendMail('renatomateusx@gmail.com', LSubject, LHTML, arrayAttachments);
                                    console.log("Enviei EMail", LReturnEmail);
                                    if (LReturnEmail) {
                                        console.log("Email Enviado");
                                        const updateFulFillment = await fulfillments.UpdateStatusFulFillmentInternal(id_usuario, id, statusShip, moment().format(), statusTracker);
                                        if (updateFulFillment) {
                                        }
                                        else {
                                            console.log("Error", updateFulFillment);
                                       }
                                    }
                                });

                            }
                        }
                    }                    
                  
                }
                /* AQUI TERMINA */
                
            }
            var LDataProximo = moment()
                .add({ days: 1 })
                .format();
            const LUpdateProximoPagamento = await fulfillments.UpdateStatusFulFillmentInternalProximaConsulta(id_usuario, id, LDataProximo);
        });
    })
    .catch((error) => {
        console.log("Erro ao pegar o fulfillment", error);
    })
// console.log('Serviço de Shipment Rodando!', moment().format('HH:mm:ss'));












    
});

module.exports = router;