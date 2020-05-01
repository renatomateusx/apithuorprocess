var jwt = require('jsonwebtoken');
const constantes = require('../resources/constantes');
/*DEIXEI COMENTADO PARA COLOCAR, SE FOR PRECISO, NO ARQUIVO VIEWS/LAYOUT.PUG script(src='https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js')*/
module.exports.getErroCode = function (erro) {
    if (erro.toUpperCase() == "CC_REJECTED_BAD_FILLED_CARD_NUMBER") return constantes.CC_REJECTED_BAD_FILLED_CARD_NUMBER;
};
