var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');


/* GET all Users. */
router.get('/GetTokenByUser', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/token.pagamento');
    var Token = db.Mongoose.model('tokenpagamento', db.TokenPagamentoSchema, 'tokenpagamento');
    Token.find()
      .where('email_usuario').equals(req.body.email)
      .lean().exec(function (e, docs) {
      res.json(docs);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/AddTokenPagamento', utilis.verifyJWT, function (req, res, next) {
  try {

    var db = require('../schemas/token.pagamento');
    var Token = db.Mongoose.model('tokenpagamento', db.TokenPagamentoSchema, 'tokenpagamento');
    var newtoken = new Token({
      token_pagamento: req.body.token_pagamento,
      mes_referencia: req.body.mes_referencia,
      token_confirmado: req.body.token_confirmado,
      email_usuario: req.body.email_usuario
    });
    newtoken.save(function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        res.end();
        return;
      }
      res.json(newcustomer);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.put('/UpdateTokenPagamento', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/token.pagamento');
    var Token = db.Mongoose.model('tokenpagamento', db.TokenPagamentoSchema, 'tokenpagamento');
    Token.updateOne({ _id: req.params.id }, req.body, { upsert: true }, function (err, doc) {
      if (err) {
        res.status(500).json({ error: err.message });
        res.end();
        return;
      }
      res.json(req.body);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

module.exports = router;
