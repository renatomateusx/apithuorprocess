var express = require('express');
var checkoutsSchema = require('../schemas/checkouts');

var router = express.Router();
/* GET home page. */
router.post('/GetCheckoutAtivo', checkoutsSchema.GetCheckoutAtivo);
router.post('/DoPay', checkoutsSchema.DoPay)
router.post('/DoPayTicket', checkoutsSchema.DoPayTicket)
router.get('/GetIntegracaoCheckout', checkoutsSchema.GetIntegracaoCheckout);
router.post('/GetIntegracaoCheckoutByID', checkoutsSchema.GetIntegracaoCheckoutByID);
router.post('/InsertCheckoutMP', checkoutsSchema.InsertCheckoutMP);
router.post('/UpdateStatusMP', checkoutsSchema.UpdateStatusMP);
router.post('/UpdateAtivaBoletoMP', checkoutsSchema.UpdateAtivaBoletoMP);
router.post('/UpdateAutoProcessamentoMP', checkoutsSchema.UpdateAutoProcessamentoMP);

module.exports = router;
