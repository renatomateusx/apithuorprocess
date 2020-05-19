var express = require('express');
var checkoutsSchema = require('../schemas/checkouts');
var checkoutsPSSchema = require('../schemas/checkoutPS');
var checkoutsPayUSchema = require('../schemas/checkoutPayU');

var router = express.Router();
/* GET home page. */
router.post('/GetCheckoutAtivo', checkoutsSchema.GetCheckoutAtivo);
router.post('/GetCheckoutByID', checkoutsSchema.GetCheckoutByID);
router.post('/DoPay', checkoutsSchema.DoPay)
router.post('/DoPayTicket', checkoutsSchema.DoPayTicket)
router.get('/GetIntegracaoCheckout', checkoutsSchema.GetIntegracaoCheckout);
router.post('/GetIntegracaoCheckoutByID', checkoutsSchema.GetIntegracaoCheckoutByID);
router.post('/InsertCheckoutMP', checkoutsSchema.InsertCheckoutMP);
router.post('/UpdateStatusMP', checkoutsSchema.UpdateStatusMP);
router.post('/UpdateAtivaBoletoMP', checkoutsSchema.UpdateAtivaBoletoMP);
router.post('/UpdateAutoProcessamentoMP', checkoutsSchema.UpdateAutoProcessamentoMP);
router.post('/SessionPagSeguro', checkoutsPSSchema.PublicKey);
router.post('/DoPayPagSeguroCard', checkoutsPSSchema.DoPayPagSeguroCard);

router.post('/DoPayCardPayU', checkoutsPayUSchema.DoPay);

module.exports = router;
