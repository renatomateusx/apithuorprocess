var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');
var extras = require('../schemas/extras');
var done = false;
router.post('/ViaCEP', async function (req, res, next) {
  try {
    let LCep = req.body.cep;
    const LRetorno = await extras.GetCEP(req, res, next);
    res.json(LRetorno);
    res.end();

  } catch (error) {
    res.json(error);
    res.end();
  }
});


module.exports = router;
