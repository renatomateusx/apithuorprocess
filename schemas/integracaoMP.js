var pool = require('../db/queries');
var jwt = require('jsonwebtoken');
const mercadopago = require("mercadopago");
const constantes = require('../resources/constantes');

module.exports.GetIntegracaoMP =  (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log(mercadopago);
            mercadopago.configure({
                sandbox: true,
                access_token: constantes.SAND_BOX_MP_PUBLICK_KEY
            })
            const accessToken = await mercadopago.getAccessToken();
            console.log(accessToken);
            
        } catch (error) {
            reject(error);

        }
    });
}