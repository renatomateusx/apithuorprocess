var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var produtosSchema = require('../schemas/produtos');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetProdutos', produtosSchema.GetProdutos);

router.post('/GetProdutoByID', produtosSchema.GetProdutoByID);

router.post('/AddProduto', produtosSchema.AddProduto);

router.put('/UpdateProduto', produtosSchema.UpdateProduto);

router.post('/DeleteProduto', produtosSchema.DeleteProduto);

module.exports = router;
