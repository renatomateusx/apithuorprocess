var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');

router.post('/ViaCEP', function(req, res, next) {
  try {
    res.json(null);
    let LCep = req.body.cep;
    let URL = `https://viacep.com.br/ws/${LCep}/json/`;
    utilis
      .makeAPICallExternal(URL)
      .then(responseJSON => {
        // res.json(responseJSON);
      })
      .catch(error => {
        console.log('Erro ao pegar dados do VIACEP', error);
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});


module.exports = router;
