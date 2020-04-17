var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');


/* GET all Users. */
router.post('/VerificaCombinacao', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/combinacao');
    var Combinacao = db.Mongoose.model('combinacao', db.CombinacaoSchema, 'combinacao');
    Combinacao.find()
      .or('email_origem').equals(req.body.email_origem).and('email_destino').equals(req.body.email_destino)
      .or('email_origem').equals(req.body.email_destino).and('email_destino').equals(req.body.email_origem)
      .lean().exec(function (e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});
/* Get Users Combinações */
router.post('/GetCombinacoes', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/combinacao');
    var Combinacao = db.Mongoose.model('combinacao', db.CombinacaoSchema, 'combinacao');
    Combinacao.find()
      .where('usuario_origem').equals(req.body.usuario_origem)
      .or('usuario_destino').equals(req.body.usuario_origem)
      .lean().exec(function (e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/GetUsersLikes', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/combinacao');
    var Combinacao = db.Mongoose.model('combinacao', db.CombinacaoSchema, 'combinacao');
    Combinacao.find()
      .where('usuario_destino').equals(req.body.usuario_origem)
      .lean().exec(function (e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

/* Get Users Combinations */
router.get('/:email_origem/:email_destino', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/combinacao');
    var Combinacao = db.Mongoose.model('combinacao', db.CombinacaoSchema, 'combinacao');
    Combinacao.find({ email_origem: req.params.email_from, email_destino: req.params.email_destino }).lean().exec(function (e, docs) {
      res.json(docs);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/AddCombinacao', utilis.verifyJWT, function (req, res, next) {
  try {

    var db = require('../schemas/combinacao');
    var Combinacao = db.Mongoose.model('combinacao', db.CombinacaoSchema, 'combinacao');
    var newCombine = new Combinacao({
      email_origem: req.body.usuario_origem,
      nome_origem: req.body.nome_origem,
      email_destino: req.body.usuario_destino,
      nome_destino: req.body.nome_destino
    });
    newCombine.save(function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        res.end();
        return;
      }
      res.json(newCombine);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});


router.put('/:id', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/combinacao');
    var Combinacao = db.Mongoose.model('combinacao', db.CombinacaoSchema, 'combinacao');
    Combinacao.updateOne({ _id: req.params.id }, req.body, { upsert: true }, function (err, doc) {
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
