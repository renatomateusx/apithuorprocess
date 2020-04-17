var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');

router.post('/VerificaVisitante', utilis.verifyJWT, function (req, res, next) {
  try {
    
    var db = require('../schemas/visitas');
    var Visitas = db.Mongoose.model('visitas', db.VisitasSchema, 'visitas');
    Visitas.find()
      .where('email_origem').equals(req.body.email_origem)
      .where('email_destino').equals(req.body.email_destino)
      .lean().exec(function (e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

/* GET all Users. */
router.post('/GetVisitas', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/visitas');
    var Visitas = db.Mongoose.model('visitas', db.VisitasSchema, 'visitas');
    Visitas.find()
      .where('email_destino').equals(req.body.email_destino)
      .sort({'ultima_visita': 'desc'})
      .exec(function (e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/DeleteVisitas', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/visitas');
    var Visitas = db.Mongoose.model('visitas', db.VisitasSchema, 'visitas');
    Visitas.deleteOne({ _id: req.body._id }, { upsert: true }, function (err, doc) {
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

router.post('/AddVisita', utilis.verifyJWT, function (req, res, next) {
  try {

    var db = require('../schemas/visitas');
    var Visitas = db.Mongoose.model('visitas', db.VisitasSchema, 'visitas');
    var newVisit = new Visitas({
      email_origem: req.body.email_origem,
      nome_origem: req.body.nome_origem,
      email_destino: req.body.email_destino,
      nome_destino: req.body.nome_destino
    });
    newVisit.save(function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        res.end();
        return;
      }
      res.json(newVisit);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.put('/UpdateVisita', utilis.verifyJWT, function (req, res, next) {
  try {    
    var db = require('../schemas/visitas');
    var Visitas = db.Mongoose.model('visitas', db.VisitasSchema, 'visitas');
    Visitas.updateOne({ _id: req.body._id }, req.body, { upsert: true }, function (err, doc) {
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
