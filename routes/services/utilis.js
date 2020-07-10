const constantes = require('../../resources/constantes');
const nodemailer = require('nodemailer');
const path = require("path");
const fs = require('fs');
const moment = require("moment");
const UTILIS = require('../../resources/util');


module.exports.SendMailTest = async (req, res, next) => {
    const { to, subject, html, arrayAttachments, from } = req.body;
    this.SendMail(to, subject, html, arrayAttachments, from)
        .then((resEmail) => {
            res.status(200).send('OK');
        })
        .catch((error) => {
            console.log("Erro ao ", error);
        })


}


module.exports.SendMailNonUsed = (to, subject, html, arrayAttachments, from) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(to, subject, html, from);
            if (arrayAttachments == null) { arrayAttachments = []; }
            sgMail.setApiKey('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');
            const msg = {
                to: to,
                from: from,
                subject: subject,
                html: html,
                attachments: arrayAttachments
            };
            sgMail.send(msg)
                .then((res) => {
                    resolve(1)
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        } catch (error) {
            console.log("er", error.body);
            reject("Erro no transporter:", error);
        }
    })

}

module.exports.SendMailMailJet = (to, subject, html, arrayAttachments, from) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(to, subject, html, from);
            const mailjet = require('node-mailjet')
                .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
            if (arrayAttachments == null) { arrayAttachments = []; }
            sgMail.setApiKey('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');
            const msg = {
                to: to,
                from: from,
                subject: subject,
                html: html,
                attachments: arrayAttachments
            };
            sgMail.send(msg)
                .then((res) => {
                    resolve(1)
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        } catch (error) {
            console.log("er", error.body);
            reject("Erro no transporter:", error);
        }
    })

}

module.exports.SendMail = (to, subject, html, arrayAttachments, from) => {
    return new Promise((resolve, reject) => {
        try {
            var transporter = nodemailer.createTransport({
                host: constantes.HOST_SMTP,
                service: constantes.HOST_SERVICE,
                port: constantes.PORT_SMTP,
                secure: false,
                auth: {
                    user: constantes.USER_SMTP,
                    pass: constantes.PASS_SMTP
                }
            });
            if (arrayAttachments == null) { arrayAttachments = []; }
            var fromM = from || constantes.NOME_FROM;
            var emailFrom = fromM + constantes.EMAIL_FROM_TAG;
            var mailOptions = {
                from: emailFrom,
                to: to,
                subject: subject,
                attachments: arrayAttachments,
                html: html
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject("erro no e-mail", error);
                } else {
                    /*console.log("Email Enviado");*/
                    resolve(1);
                }
            });
        } catch (error) {
            reject("Erro no transporter", error);
        }
    })

}

module.exports.getStatusRastreio = (actualStatus, status) => {
    return new Promise((resolve, reject) => {
        try {
            if (status == undefined && status.length < 1) {
                resolve(actualStatus);
            }
            var LStatus = "";
            if (status.toUpperCase() == "TRANSIT") { LStatus = "Em Trânsito - " };
            if (status.toUpperCase() == "PICKUP") { LStatus = "Saiu para Entrega - " };
            if (status.toUpperCase() == "DELIVERED") { LStatus = "Entregue - " };
            resolve(LStatus);
        }
        catch (erro) {
            console.log("Erro ao pegar status do objeto rastreio - Utilis - ", erro);
            reject(erro);
        }
    })
}

module.exports.getDetail = (actualDetail, detail) => {
    return new Promise((resolve, reject) => {
        try {
            if (detail != undefined && detail.length > 2) {
                resolve(detail);
            }
            else {
                resolve(actualDetail);
            }
        }
        catch (erro) {
            console.log("Erro ao pegar status do objeto rastreio - Utilis - ", erro);
            reject(erro);
        }
    })
}
function SendEmailBoleto(JSON_EMAIL, ordem, PJSON_LOJA) {
    return new Promise((resolve, reject) => {      
        try {
            var template = path.resolve('public/templates/template_boleto_email.html');
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                var LHTML = html;
                var LNome = UTILIS.toCamelCase(JSON_EMAIL.nome_completo).split(' ')[0];
                LHTML = LHTML.replace("{first_name}", LNome);
                const LVencimentoBoleto = moment(JSON_EMAIL.vencimentoBoleto).format('DD/MM/YYYY');
                LTitulo = constantes.STRING_SUBJECT_EMAIL_BOLETO.replace("{data_vencimento}", LVencimentoBoleto).replace("{pedido}", ordem);
                var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailBoleto);
                arrayAttachments.forEach((obj, i) => {
                    obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                });
                LHTML = LHTML.replace("{vencimento", LVencimentoBoleto);
                LHTML = LHTML.replace("{bar_cod}", JSON_EMAIL.barcode);
                LHTML = LHTML.replace(/{link_boleto}/g, JSON_EMAIL.urlBoleto);
                LHTML = LHTML.replace("{total}", JSON_EMAIL.valor);
                LHTML = LHTML.replace("{ordem_id}", ordem);
                var from = constantes.FROM_MAIL.replace("{nome_loja}", PJSON_LOJA.nome_loja).replace("{email_loja}", PJSON_LOJA.email_loja);
                const LRetornoMail = await module.exports.SendMail(JSON_EMAIL.email, LTitulo, LHTML, arrayAttachments, PJSON_LOJA.nome_loja);
                if (LRetornoMail == 1) {
                    //res.status(200).send('E-mail de redefinição enviado');
                    resolve(1);
                }

            });
        }
        catch (error) {
            reject(error);
        }
    })
}
module.exports.SendEmailBoleto = async (req, res, next) => {
    const {JSON_EMAIL, ordem} = req.body;
   
    const LRetornoEmailBoleto = await SendEmailBoleto(JSON_EMAIL, ordem);
    res.json(LRetornoEmailBoleto);
}

module.exports.SendEmailBoletoInternal = (PJSON, PJSONLoja) => {
    return new Promise(async (resolve, reject)=>{
        try{
            const Ordem = PJSON.ordem_id;
            const OrdemID = JSON.parse(Ordem);
            console.log(OrdemID);
            const LRetornoEmailBoleto = await SendEmailBoleto(PJSON, OrdemID.order.order_number, PJSONLoja);
            resolve(LRetornoEmailBoleto);
        }
        catch(error){
            reject(error);
        }
    })
  
}

module.exports.sleep = (seconds) => {
    return new Promise(r => setTimeout(r, seconds));
}