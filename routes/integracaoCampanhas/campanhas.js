var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var campanhas = require('../../schemas/integracaoCampanhas/campanhas');


/* User Pagination */
//utilis.verifyJWT,
router.post('/GetCampanhas', campanhas.GetCampanhas);
router.post('/GetIntegracaoCampanhaByID', campanhas.GetCampanhaByID);
router.post('/SaveCampanhaCartAbandon', campanhas.SaveCampanhaCartAbandon);
router.post('/GetCampanhaCarrinhoAbandonado', campanhas.GetCampanhaCarrinhoAbandonado);


router.post('/GetCampanhasBoleto', campanhas.GetCampanhasBoleto);
router.post('/GetIntegracaoCampanhaByIDBoleto', campanhas.GetCampanhaByIDBoleto);
router.post('/SaveCampanhaBoleto', campanhas.SaveCampanhaBoleto);
router.post('/GetCampanhaBoleto', campanhas.GetCampanhaBoleto);

module.exports = router;
