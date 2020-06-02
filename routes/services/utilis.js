const constantes = require('../../resources/constantes');
const nodemailer = require('nodemailer');
const path = require("path");
const fs = require('fs');
const moment = require("moment");
const UTILIS = require('../../resources/util');
module.exports.SendMail = (to, subject, html, arrayAttachments, from) => {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: constantes.HOST_SMTP,
            service: constantes.HOST_SERVICE,
            port: constantes.PORT_SMTP,
            secure: true,
            auth: {
                user: constantes.USER_SMTP,
                pass: constantes.PASS_SMTP
            }
        });
        if (arrayAttachments == null) { arrayAttachments = []; }
        var mailOptions = {
            from: from || constantes.EMAIL_FROM_TESTES,
            to: to,
            subject: subject,
            attachments: arrayAttachments,
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                /*console.log("Email Enviado");*/
                resolve(1);
            }
        });
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
function SendEmailBoleto(JSON_EMAIL) {
    return new Promise((resolve, reject) => {
        //console.log(JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador);
        try {
            var template = path.resolve('public/templates/template_boleto_email.html');
            fs.readFile(template, 'utf8', async function (err, html) {
                if (err) {
                    throw err;
                }
                var LHTML = html;
                var LNome = UTILIS.toCamelCase(JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.nome_completo).split(' ')[0];
                LHTML = LHTML.replace("{first_name}", LNome);
                const LVencimentoBoleto = moment(JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.vencimentoBoleto).format('DD/MM/YYYY');
                LTitulo = constantes.STRING_SUBJECT_EMAIL_BOLETO.replace("{data_vencimento}", LVencimentoBoleto).replace("{pedido}",JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.id_transacao);
                var arrayAttachments = constantes.attachmentsAux.concat(constantes.attachmentsEmailBoleto);
                arrayAttachments.forEach((obj, i) => {
                    obj.path = constantes.URL_PUBLIC_RESOURCES_EMAIL + '/' + obj.filename
                });
                LHTML = LHTML.replace("{vencimento", LVencimentoBoleto);
                LHTML = LHTML.replace("{bar_cod}", JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.barcode);
                LHTML = LHTML.replace(/{link_boleto}/g, JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.urlBoleto);
                LHTML = LHTML.replace("{total}", JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.valor);
                LHTML = LHTML.replace("{ordem_id}", JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.id_transacao);
                var from = constantes.FROM_MAIL.replace("{nome_loja}", JSON_EMAIL.dadosCompra.dadosComprador.dadosLoja.nome_loja).replace("{email_loja}", JSON_EMAIL.dadosCompra.dadosComprador.dadosLoja.email_loja);
                const LRetornoMail = await module.exports.SendMail(JSON_EMAIL.dadosCompra.dadosComprador.dadosComprador.email, LTitulo, LHTML, arrayAttachments, from);
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
module.exports.SendEmailBoleto = (req, res, next) => {
    const JSON_EMAIL = req.body;
    res.status(200).send(SendEmailBoleto(JSON_EMAIL));
}