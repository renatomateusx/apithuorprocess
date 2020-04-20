var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var produtosSchema = require('../schemas/produtos');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetProdutos', utilis.verifyJWT, produtosSchema.GetProdutos);

router.post('/GetProdutoByID', utilis.verifyJWT, produtosSchema.GetProdutoByID);

router.post('/AddProduto', utilis.verifyJWT, produtosSchema.AddProduto);

router.put('/UpdateProduto', utilis.verifyJWT, produtosSchema.UpdateProduto);

router.post('/DeleteProduto', utilis.verifyJWT, produtosSchema.DeleteProduto);

module.exports = router;
