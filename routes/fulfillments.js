var express = require('express');
var fulfillments = require('../schemas/fulfillments');


var router = express.Router();
/* GET home page. */
router.post('/GetFulFillment', fulfillments.GetFulFillment);
router.post('/InsertFulFillment', fulfillments.InsertFulFillment);
router.post('/UpdateFulFillmentStatusInterno', fulfillments.UpdateFulFillmentStatusInterno);




module.exports = router;
