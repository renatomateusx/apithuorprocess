var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var transacaoSchema = require('../schemas/transacao');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetPedidos', transacaoSchema.GetTransacoes);


module.exports = router;
