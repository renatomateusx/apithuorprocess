var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');
var done = false;
router.post('/ViaCEP', function (req, res, next) {
  try {
    let LCep = req.body.cep;
    let URL = `https://viacep.com.br/ws/${LCep}/json/unicode`;
    /* SE DEMORAR MAIS DE 5 SEGUNDOS, É PORQUE NENHUMA ESTÁ FUNCIONANDO. */
    setTimeout(() => {
      
        console.log("foi");
        res.json(null);
        res.end();
      
    }, 5000);
    utilis
      .makeAPICallExternal(URL)
      .then(responseJSON => {
        var LCEP = {
          "cep": responseJSON.cep,
          "logradouro": responseJSON.logradouro,
          "complemento": responseJSON.complemento,
          "bairro": responseJSON.bairro,
          "localidade": responseJSON.localidade,
          "uf": responseJSON.uf,
          "unidade": responseJSON.unidade,
          "ibge": responseJSON.ibge,
          "gia": responseJSON.gia
        }

          res.json(LCEP);
          res.end();
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
