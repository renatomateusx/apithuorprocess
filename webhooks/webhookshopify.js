var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var integracaoPlataformas = require('../schemas/integracaoPlataformas');

router.post('/webhookshopify/rotas', integracaoPlataformas.WebHookShopify);


module.exports = router;