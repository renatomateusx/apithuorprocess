var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var integracaoShopify = require('../schemas/integracaoShopify');


/* User Pagination */
//utilis.verifyJWT, --- COLOCAR ISSO EM TODOS QUE PRECISAM.
router.post('/AddIntegracaoCheckout', integracaoShopify.AddIntegracaoShopifyCheckout);

router.post('/UpdateIntegracaoCheckout', integracaoShopify.UpdateIntegracaoShopifyCheckout);

router.get('/GetIntegracaoCheckout', integracaoShopify.GetIntegracaoShopifyCheckout);

router.post('/ReInstalarIntegracao', integracaoShopify.ReInstalarIntegracao);

//ESSE NÃO PRECISA DE VERIFICAR TOKEN
router.post('/CartShopify', integracaoShopify.CartShopify);

router.post('/GetDadosLoja', integracaoShopify.GetDadosLoja);

router.post('/GetDadosLojaByIDUsuario', integracaoShopify.GetDadosLojaByIDUsuario);

module.exports = router;