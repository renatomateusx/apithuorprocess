var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');
var done = false;
router.post('/ViaCEP', function (req, res, next) {
  try {
    let LCep = req.body.cep;
    let URL = `https://viacep.com.br/ws/${LCep}/json/`;
    /* SE DEMORAR MAIS DE 5 SEGUNDOS, É PORQUE NENHUMA ESTÁ FUNCIONANDO. */
    setTimeout(() => { if (done == false) { done = true; res.json(null); res.end(); } }, 5000);
    setTimeout(() => {
      urlCEP2 = `http://cep.republicavirtual.com.br/web_cep.php?cep=${LCep}&formato=json`;
      if (done == false) {
        done = true;
        utilis
          .makeAPICallExternalHeadersCustom(urlCEP2, undefined, undefined)
          .then(responseJSON => {

            responseJSON = JSON.parse(responseJSON);
            if (responseJSON.resultado == "1") {
              var LCEP = {
                "cep": responseJSON.cep,
                "logradouro": responseJSON.tipo_logradouro + " " + responseJSON.logradouro,
                "bairro": responseJSON.bairro,
                "complemento": " ",
                "localidade": responseJSON.cidade,
                "uf": responseJSON.uf
              }

              res.json(LCEP);
              res.end();
            }

          })
          .catch(error => {
            console.log('Erro ao pegar dados do Republica Virtual', error);
          });
      }
    }, 2500);
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
        if (done == false) {
          done = true;
          res.json(LCEP);
          res.end();
        }
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
