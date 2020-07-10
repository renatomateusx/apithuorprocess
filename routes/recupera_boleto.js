var express = require('express');
var recuperaBoletos = require('../schemas/recupera_boleto');


var router = express.Router();
/* GET home page. */
router.post('/GetBoletos', recuperaBoletos.GetBoletos);
router.post('/GetBoletosRecoverByID', recuperaBoletos.GetBoletoRecoveryByID);
router.post('/GetBoletosRecoverInternal', recuperaBoletos.GetBoletoRecoveryInternal);
router.post('/GetBoletosRecoverByIDInternalByID', recuperaBoletos.GetBoletoRecoveryByIDInternalByID);
router.post('/SaveBoletos', recuperaBoletos.SaveBoletoRecovery);
router.post('/UpdateStatusBoletosRecover', recuperaBoletos.UpdateStatusBoletoRecovery);

module.exports = router;
