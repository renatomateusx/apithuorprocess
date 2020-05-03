var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var produtosSchema = require('../schemas/produtos');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetProdutos', utilis.verifyJWT, produtosSchema.GetProdutos);

router.post('/GetProdutoByID', utilis.verifyJWT, produtosSchema.GetProdutoByID);

router.post('/GetProdutoByIDThuor', produtosSchema.GetProdutoByIDThuor);

router.post('/GetProdutoByIDImported', produtosSchema.GetProdutoByIDImported);

router.post('/AddProduto', utilis.verifyJWT, produtosSchema.AddProduto);

router.put('/UpdateProduto', utilis.verifyJWT, produtosSchema.UpdateProduto);

router.post('/DeleteProduto', utilis.verifyJWT, produtosSchema.DeleteProduto);

router.post('/UpdateStatusProduto', utilis.verifyJWT, produtosSchema.UpdateStatusProduto);

router.post('/UpdateTipoProduto', utilis.verifyJWT, produtosSchema.UpdateTipoProduto);

router.post('/UpdateCustomFreteProduto', utilis.verifyJWT, produtosSchema.UpdateCustomFreteProduto);

router.post('/UpdateTipoFreteProduto', utilis.verifyJWT, produtosSchema.UpdateTipoFreteProduto);

router.post('/UpdateURLDirProduto', utilis.verifyJWT, produtosSchema.UpdateURLDirProduto);

router.post('/GetPrazoEnvioVarianteByID', utilis.verifyJWT, produtosSchema.GetPrazoEnvioVarianteByID);

router.post('/SalvaPrazoEnvioVarianteByID', utilis.verifyJWT, produtosSchema.SalvaPrazoEnvioVarianteByID);

router.post('/SalvaGerenciamentoEstoqueVarianteByID', utilis.verifyJWT, produtosSchema.SalvaGerenciamentoEstoqueVarianteByID);

router.post('/DesativaGerenciamentoEstoquePorVarianteID', utilis.verifyJWT, produtosSchema.DesativaGerenciamentoEstoquePorVarianteID);

router.post('/GetDadosEstoquePorVarianteID', utilis.verifyJWT, produtosSchema.GetDadosEstoquePorVarianteID);





module.exports = router;
