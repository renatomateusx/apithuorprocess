
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