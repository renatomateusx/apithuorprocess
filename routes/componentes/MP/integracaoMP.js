var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../../../resources/util');
var integracaoMP = require('../../../schemas/integracaoMP');


/* User Pagination */
//utilis.verifyJWT,
router.get('/GetIntegracaoMP', integracaoMP.GetIntegracaoMP);


module.exports = router;
