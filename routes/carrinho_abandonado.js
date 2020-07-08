var express = require('express');
var carrinho = require('../schemas/carrinho_abandonado');


var router = express.Router();
/* GET home page. */
router.post('/GetCarrinho', carrinho.GetCarrinho);
router.post('/GetCarrinhoByID', carrinho.GetCarrinhoByID);
router.post('/GetCarrinhoInternal', carrinho.GetCarrinhoInternal);
router.post('/GetCarrinhoByIDInternalByID', carrinho.GetCarrinhoByIDInternalByID);
router.post('/SaveCarrinho', carrinho.SaveCarrinho)
router.post('/UpdateStatusCarrinho', carrinho.UpdateStatusCarrinho)
router.post('/UpdateDadosClienteCarrinho', carrinho.UpdateDadosClienteCarrinho)

module.exports = router;
