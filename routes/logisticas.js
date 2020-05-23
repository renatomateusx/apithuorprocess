var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var logisticaSchema = require('../schemas/logisticas');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetFretes', logisticaSchema.GetFretes);

router.post('/TrackingCode', logisticaSchema.TrackingCode);


module.exports = router;
