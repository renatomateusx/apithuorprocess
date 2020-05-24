var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var campanhas = require('../../schemas/integracaoCampanhas/campanhas');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetCampanhas', campanhas.GetCampanhas);
router.post('/GetIntegracaoCampanhaByID', campanhas.GetCampanhaByID)

module.exports = router;
