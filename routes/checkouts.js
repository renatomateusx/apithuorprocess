var express = require('express');
var checkoutsSchema = require('../schemas/checkouts');

var router = express.Router();
/* GET home page. */
router.post('/GetCheckoutAtivo', checkoutsSchema.GetCheckoutAtivo);
router.post('/DoPay', checkoutsSchema.DoPay)

module.exports = router;
