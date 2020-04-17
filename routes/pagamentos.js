var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');
/* SANDBOX = '7DD3EB64B975493CAAE20A9B8F827BE5' */
/* PRODUÇÃO= '75dd6907-7e0a-4cbb-a0dd-019f3ccad3c720502a0944cbb6bd4b5b9117927e3e64eceb-e7c8-41ca-9655-4ce5bfeca74c' */
router.get('/GetSession', function(req, res, next) {
  try {
    let dados = {
      email: 'renatomateusx@gmail.com',
      token:
        '75dd6907-7e0a-4cbb-a0dd-019f3ccad3c720502a0944cbb6bd4b5b9117927e3e64eceb-e7c8-41ca-9655-4ce5bfeca74c',
    };
    let URL = `https://ws.pagseguro.uol.com.br/v2/sessions`;
    let body = utilis.formatJsonData(dados);
    utilis
      .makeAPICallExternalParams(URL, body)
      .then(responseJSON => {
        res.json(responseJSON);
      })
      .catch(error => {
        console.log('Erro ao pegar dados do GetSession', error);
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.get('/GetPaymentMethods', function(req, res, next) {
  try {
    utilis
      .loadExternalJavaScriptFile(PagSeguro)
      .then(res => {
        PagSeguro.DirectPayment.getPaymentMethods({
          amount: 4.99,
          success: response => {
            console.log(response);
          },
          error: response => {
            console.log('Error', response);
          },
          complete: response => {
            console.log('Complete', response);
          },
        });
      })
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.get('/SenderHashReady', function(req, res, next) {
  try {
    PagSeguroDirectPayment.onSenderHashReady(response => {
      if (response.status == 'error') {
        console.log(response.message);
        res.json(response.message);
      }
      res.json(response.senderHash); //Hash estará disponível nesta variável.
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.get('/GetBrand', function(req, res, next) {
  try {
    PagSeguroDirectPayment.getBrand({
      cardBin: 411111,
      success: response => {
        //bandeira encontrada
      },
      error: response => {
        //tratamento do erro
      },
      complete: response => {
        //tratamento comum para todas chamadas
      },
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.get('/CreateCardToken', function(req, res, next) {
  try {
    PagSeguroDirectPayment.createCardToken({
      cardNumber: '4111111111111111', // Número do cartão de crédito
      brand: 'visa', // Bandeira do cartão
      cvv: '013', // CVV do cartão
      expirationMonth: '12', // Mês da expiração do cartão
      expirationYear: '2026', // Ano da expiração do cartão, é necessário os 4 dígitos.
      success: response => {
        // Retorna o cartão tokenizado.
      },
      error: response => {
        // Callback para chamadas que falharam.
      },
      complete: response => {
        // Callback para todas chamadas.
      },
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/AssinarPlano', function(req, res, next) {
  try {
    let LReq = JSON.stringify(req.body);
    let LAuth = `email=renatomateusx@gmail.com&token=75dd6907-7e0a-4cbb-a0dd-019f3ccad3c720502a0944cbb6bd4b5b9117927e3e64eceb-e7c8-41ca-9655-4ce5bfeca74c`;
    let URL = `https://ws.pagseguro.uol.com.br/pre-approvals?` + LAuth;
    utilis
      .makeAPICallExternalParamsJSON(URL, LReq)
      .then(responseJSON => {
        res.json(responseJSON);
      })
      .catch(error => {
        console.log('Erro ao Assinar Plano', error);
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/CriarPlano', function(req, res, next) {
  try {
    let LReq = JSON.stringify(req.body);
    console.log(LReq);
    let LAuth = `email=renatomateusx@gmail.com&token=75dd6907-7e0a-4cbb-a0dd-019f3ccad3c720502a0944cbb6bd4b5b9117927e3e64eceb-e7c8-41ca-9655-4ce5bfeca74c`;
    let URL = `https://ws.pagseguro.uol.com.br/pre-approvals/request?` + LAuth;
    utilis
      .makeAPICallExternalParamsJSON(URL, LReq)
      .then(responseJSON => {
        res.json(responseJSON);
      })
      .catch(error => {
        console.log('Erro ao Assinar Plano', error);
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});


router.post('/DoCheckout', function(req, res, next) {
  try {
    let LReq = JSON.stringify(req.body);
    console.log(LReq)    ;
    let URL = `https://ws.pagseguro.uol.com.br/v2/transactions`;
    utilis
      .makeAPICallExternalParams(URL, LReq)
      .then(responseJSON => {
        res.json(responseJSON);
      })
      .catch(error => {
        console.log('Erro ao Assinar Plano', error);
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});



module.exports = router;
