var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');

router.post('/VerificaNotificacao', utilis.verifyJWT, function (req, res, next) {
  try {

    var db = require('../schemas/notificacao');
    var Notificacoes = db.Mongoose.model('notificacao', db.NotificacaoSchema, 'notificacao');
    Notificacoes.find()
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
router.post('/GetNotificacao', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/notificacao');
    var Notificacoes = db.Mongoose.model('notificacao', db.NotificacaoSchema, 'notificacao');
    Notificacoes.find()
      .where('email_destino').equals(req.body.email_destino)
      .and('lida').equals(false)
      .sort({ 'data_notificacao': 'desc' })
      .exec(function (e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/DeleteNotificacao', utilis.verifyJWT, function (req, res, next) {
  try {
    var db = require('../schemas/notificacao');
    var Notificacoes = db.Mongoose.model('notificacao', db.NotificacaoSchema, 'notificacao');
    Notificacoes.deleteOne({ _id: req.body._id }, { upsert: true }, function (err, doc) {
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

router.post('/AddNotificacao', utilis.verifyJWT, function (req, res, next) {
  try {

    var db = require('../schemas/notificacao');
    var Notificacoes = db.Mongoose.model('notificacao', db.NotificacaoSchema, 'notificacao');
    var newVisit = new Notificacoes({
      email_origem: req.body.email_origem,
      nome_origem: req.body.nome_origem,
      email_destino: req.body.email_destino,
      nome_destino: req.body.nome_destino,
      data_notificacao: req.body.data_notificacao,
      acao_notificacao: req.body.acao_notificacao,
      msg_notificacao: req.body.msg_notificacao,
      lida: false
    });
    newVisit.save(function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        res.end();
        return;
      }
      let socket = req.app.get('socketio');      
      socket.emit('newNotification', req.body);
      res.json(newVisit);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});
router.put('/UpdateNotificacao', utilis.verifyJWT, function (req, res, next) {
  try {    
    var db = require('../schemas/notificacao');
    var Notificacoes = db.Mongoose.model('notificacao', db.NotificacaoSchema, 'notificacao');
    Notificacoes.updateOne({ _id: req.body._id }, req.body, { upsert: true }, function (err, doc) {
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
