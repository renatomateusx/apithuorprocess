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
//const mpExternal = require('../../public/scripts/mercadopago');





var j = schedule.scheduleJob('* * */23 * * *', function () {
    fulfillments.GetFulFillmentList()
        .then((resFul) => {
            resFul.forEach(async (obj, i) => {
                const order_id = obj.order_id;
                const id_usuario = obj.id_usuario;
                const id = obj.id;
                const fulfillment_id = obj.fulfillment_id;
                const email = obj.email;
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
                //console.log('diff', duration.asHours());
                if (duration.asHours() >= 24) {

                    //console.log('diff', duration.asHours());
                    var LReturnTracker = await logistica.TrackingCodeInternal(tracking_number);
                    if (LReturnTracker) {
                        LReturnTracker = JSON.parse(LReturnTracker);
                        //console.log(tracking_number);   
                        // console.log("Retorno", LReturnTracker);
                        if (LReturnTracker) {
                            LReturnTracker.forEach(async (objTrack, i) => {
                                objTrack.checkpoints.forEach(async (objCheckPoint, i) => {
                                    self.LDescriptionCheckPoint = objCheckPoint.description + ' - ' || '';
                                    self.LDateCheckPoint = moment(objCheckPoint.date).format("DD/MM/YYYY HH:mm:ss");
                                    self.LStatusCheckPoint = await utilisEmail.getStatusRastreio(self.LStatusCheckPoint, objCheckPoint.status);
                                    self.LDetailCheckPoint = await utilisEmail.getDetail(self.LDateCheckPoint, objCheckPoint.details);
                                    if (objCheckPoint.status == "DELIVERED") {
                                        LSIT = " foi ENTREGUE!";
                                    } else {
                                        LSIT = " está chegando";
                                    }
                                });
                                var LSTATUS = constantes.STRING_STATUS_EMAIL;
                                LSTATUS = LSTATUS.replace("{STATUS}", self.LStatusCheckPoint || '');
                                LSTATUS = LSTATUS.replace("{LOCAL}", self.LDescriptionCheckPoint || '');
                                LSTATUS = LSTATUS.replace("{LOCAL_CIDADE}", self.LDetailCheckPoint || '');
                                LSTATUS = LSTATUS.replace("{DATA}", self.LDateCheckPoint);
                                //console.log("STATUS", LSTATUS);

                                const LUpdateTracker = moment(objTrack.lastUpdateTime).format("DD/MM/YYYY hh:mm:ss");
                                //console.log("Upate", LUpdateTracker);
                                if (LUpdateTracker > moment(last_updated).format("DD/MM/YYYY hh:mm:ss")) {
                                    console.log(LUpdateTracker, last_updated);
                                    const statusTracker = objTrack.status;
                                    var template = path.resolve('public/templates/email-encomenda.html');
                                    fs.readFile(template, 'utf8', async function (err, html) {
                                        if (err) {
                                            throw err;
                                        }
                                        var LHTML = html;
                                        var URLTrack = constantes.URL_TRACK_CODE.replace('@', 'LB121347495SG');
                                        //console.log(URLTrack);
                                        LHTML = LHTML.replace("{URL_RASTREIO}", URLTrack);
                                        LHTML = LHTML.replace("@SATUS_ENCOMENDA", LSTATUS);
                                        LHTML = LHTML.replace("@NOME_LOJA", DadosLoja.nome_loja);
                                        LHTML = LHTML.replace("@SIT", LSIT);
                                        //console.log(LHTML);
                                        var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailRastreio);
                                        arrayAttachments.forEach((obj, i) => {
                                            obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                                        });

                                        const LReturnEmail = await utilisEmail.SendMail(email, constantes.STRING_SUBJECT_EMAIL_ENCOMENDA_RASTREIO, LHTML, arrayAttachments);
                                        if (LReturnEmail) {
                                            const updateFulFillment = await fulfillments.UpdateStatusFulFillmentInternal(id_usuario, id, statusTracker, moment().format());
                                            if (updateFulFillment) {
                                            }
                                            else {
                                                console.log("Error", updateFulFillment);
                                            }
                                        }
                                    });

                                }
                            })
                        }
                    }
                }
            });
        })
        .catch((error) => {
            console.log("Erro ao pegar o fulfillment", error);
        })
    console.log('Serviço de Shipment Rodando!', moment().format('HH:mm:ss'));
});



module.exports = router;