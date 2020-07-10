var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
const utilis = require('../resources/util');
const format = require('string-format');
const transacoes = require('./transacao');
var moment = require("moment");


module.exports.SendSMS = (body, from, to) => {
    return new Promise((resolve, reject) => {
        try {
            var twilio = require('twilio');
            var client = new twilio(constantes.SMS_ACCOUNT_ID, constantes.SMS_ACCOUNT_TOKEN);
            client.messages.create({
                body: body,
                to: to,  // Text this number
                from: from // From a valid Twilio number
            })
                .then((message) => {
                    console.log(message.sid);
                    resolve(1);
                });

        } catch (error) {
            reject(error);
        }
    })
}

module.exports.SendWhatsApp = (body, from, to, mediaURL) => {
    return new Promise((resolve, reject) => {
        try {
            var LImages = [];
            if (mediaURL) {
                if (mediaURL.length > 0) {
                    mediaURL.forEach((objURL, i) => {
                        LImages.push(objURL);
                    })
                }
            }
            var twilio = require('twilio');
            var client = new twilio(constantes.WHATSAPP_ACCOUNT_ID, constantes.WHATSAPP_ACCOUNT_TOKEN);
            client.messages.create({
                mediaUrl: LImages,
                from: from, // From a valid Twilio number
                body: body,
                to: `whatsapp:${to}`,  // Text this number
               
            })
                .then((message) => {
                    console.log('Mensagem WhatsApp Enviada: ', message.sid);
                    resolve(1);
                });

        } catch (error) {
            reject(error);
        }
    })
}
