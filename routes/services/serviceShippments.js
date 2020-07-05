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

var rules = new schedule.RecurrenceRule();

rules.hour = 0;
rules.minute = 0;
rules.second = 1

var ja = schedule.scheduleJob("* * */23 * * * ", async function () {
    fulfillments.GetFulFillmentList()
        .then((resFul) => {
            resFul.forEach(async (obj, i) => {

                const order_id = obj.order_id;
                const id_usuario = obj.id_usuario;
                const id = obj.id;
                const fulfillment_id = obj.fulfillment_id;
                const email = obj.email;
                const statusText = obj.status_text || '';
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
                var days = constantes.DAYS_ADD_NEXT_REQUEST_TRACKER_SHIPPMENT;
                //console.log('diff', duration.asHours());
                if (duration.asHours() >= 23) {

                    //console.log('diff', duration.asHours());
                    // console.log(tracking_number);
                    const awa = await utilisEmail.sleep(25000);
                    const LReturn = await logistica.TrackingCodeInternalNinja(tracking_number);
                    if (div.indexOf("aduaneira finalizadaa") > -1) {
                        days = constantes.DAYS_ADD_NEXT_REQUEST_TRACKER_SHIPPMENT_MINUS;
                    }
                    const dom = new JSDOM(LReturn);
                    const item = dom.window.document.getElementsByClassName("year")[0].textContent;
                    var itemDate = item.split('/');
                    var dateFinal = itemDate[0] + '-' + itemDate[1] + '-' + '20' + itemDate[2];
                    if (item.length > 5) {
                        const ItemDiv = dom.window.document.getElementsByClassName("item")[0];
                        const itemStatus = dom.window.document.getElementsByTagName("li");
                        const status = itemStatus[2].innerHTML;
                        if (status && status.length > 1) {
                            if (statusText != status) {
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
                                console.log('lst', moment(last_updated, 'YYYY-MM-DD').format());
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
                                        const LReturnEmail = await utilisEmail.SendMail('renatomateusx@gmail.com', LSubject, LHTML, arrayAttachments, DadosLoja.nome_loja);
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
                    .add({ days: days })
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