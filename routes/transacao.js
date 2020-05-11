var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var transacaoSchema = require('../schemas/transacao');
var checkoutPSSchema = require('../schemas/checkoutPS');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetPedidos', transacaoSchema.GetTransacoes);
router.post('/GetPedidosByID', transacaoSchema.GetTransacoesByID);
router.post('/ReembolsarPedidoByID', transacaoSchema.ReembolsarPedidoByID);
router.post('/ReembolsarPedidoPSByID', checkoutPSSchema.ReembolsarPedidoPSByID);



module.exports = router;
