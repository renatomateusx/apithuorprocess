var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var integracaoShopify = require('../schemas/integracaoPlataformas');

/* User Pagination */
//utilis.verifyJWT, --- COLOCAR ISSO EM TODOS QUE PRECISAM.
router.post('/AddIntegracaoCheckout', integracaoShopify.AddIntegracaoShopifyCheckout);

router.post('/UpdateIntegracaoCheckout', integracaoShopify.UpdateIntegracaoShopifyCheckout);

router.get('/GetIntegracaoCheckout', integracaoShopify.GetIntegracaoShopifyCheckout);


router.post('/WebHookShopify', integracaoShopify.WebHookShopify);

//ESSE NÃO PRECISA DE VERIFICAR TOKEN
router.post('/CartShopify', integracaoShopify.CartShopify);

router.post('/GetDadosLoja', integracaoShopify.GetDadosLoja);
router.get('/GetDadosLojaShop', integracaoShopify.GetDadosLoja);

router.post('/GetDadosLojaByIDUsuario', integracaoShopify.GetDadosLojaByIDUsuario);

router.get('/GetIntegracaoPlataforma', integracaoShopify.GetIntegracaoPlataforma);

router.post('/GetIntegracaoPlataformaByID', integracaoShopify.GetIntegracaoPlataformaByID);
router.post('/InserePlataformaShopify', integracaoShopify.AddIntegracaoShopifyCheckout);

router.post('/UpdateStatus', integracaoShopify.UpdateStatus);
router.post('/AutoSinc', integracaoShopify.AutoSinc);
router.post('/PulaCarrinho', integracaoShopify.PulaCarrinho);
router.post('/LimpaCarrinho', integracaoShopify.LimpaCarrinho);




module.exports = router;