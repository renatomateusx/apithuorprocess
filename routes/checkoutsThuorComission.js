var express = require('express');
var checkoutsSchema = require('../schemas/checkoutsThuorComission');

var router = express.Router();
/* GET home page. */

router.post('/DoPay', checkoutsSchema.DoPay);

module.exports = router;
