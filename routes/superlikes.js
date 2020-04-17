var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');

/* GET all Users. */
router.post('/VerificaSuperLike', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/SuperLike');
    var SuperLike = db.Mongoose.model('superlike', db.SuperLikeSchema, 'superlike');
    SuperLike.find()
      .where('email_origem').equals(req.body.email_origem).where('email_destino').equals(req.body.email_destino)
      .or('email_origem').equals(req.body.email_destino).or('email_destino').equals(req.body.email_origem)
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
router.post('/GetSuperLike', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/SuperLike');
    var SuperLike = db.Mongoose.model('superlike', db.SuperLikeSchema, 'superlike');
    SuperLike.find()
      .where('usuario_origem').equals(req.body.usuario_origem).or('usuario_destino').equals(req.body.usuario_origem)
      .lean().exec(function (e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/GetUsersSuperLikes', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/SuperLike');
    var SuperLike = db.Mongoose.model('superlike', db.SuperLikeSchema, 'superlike');
    SuperLike.find()
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

router.post('/AddSuperLike', utilis.verifyJWT, function (req, res, next) {
  try {

    var db = require('../schemas/SuperLike');
    var SuperLike = db.Mongoose.model('superlike', db.SuperLikeSchema, 'superlike');
    var newCombine = new SuperLike({
      email_origem: req.body.email_from,
      nome_origem: req.body.nome,
      email_destino: req.body.email_destino,
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
    var db = require('../schemas/SuperLike');
    var SuperLike = db.Mongoose.model('superlike', db.SuperLikeSchema, 'superlike');
    SuperLike.updateOne({ _id: req.params.id }, req.body, { upsert: true }, function (err, doc) {
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
