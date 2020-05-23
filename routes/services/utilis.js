
const constantes = require('../../resources/constantes');
const nodemailer = require('nodemailer');

module.exports.SendMail = (to, subject, html, arrayAttachments) => {
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
        var mailOptions = {
            from: constantes.EMAIL_FROM,
            to: to,
            subject: subject,
            attachments: arrayAttachments,
            html: html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(1);
            }
        });
    })

}

module.exports.getStatusRastreio = (actualStatus, status) => {
    return new Promise((resolve, reject) => {
        try {
            if(status == undefined && status.length < 1){
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
            if(detail != undefined && detail.length > 2){
                resolve(detail);
            }
            else{
                resolve(actualDetail);
            }
        }
        catch (erro) {
            console.log("Erro ao pegar status do objeto rastreio - Utilis - ", erro);
            reject(erro);
        }
    })
}