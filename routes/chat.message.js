var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');
router.get('/', utilis.verifyJWT, function(req, res, next) {
  try {
    var db = require('../schemas/chat.message');
    var Chats = db.Mongoose.model('chat', db.ChatSchema, 'chat');
    Chats.find({})
      .lean()
      .exec(function(e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});
/* Get Chat ID */
router.post('/GetChat', utilis.verifyJWT, function(req, res, next) {
  try {
    var db = require('../schemas/chat.message');
    var Chats = db.Mongoose.model('chat', db.ChatSchema, 'chat');
    Chats.find({idChat: req.body.idChat})
      .limit(50)
      .sort({_id: -1})
      .lean()
      .exec(function(e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

/* Get Chat ID */
router.post('/GetChatPorEmail', utilis.verifyJWT, function(req, res, next) {
  try {
    var db = require('../schemas/chat.message');
    var Chats = db.Mongoose.model('chat', db.ChatSchema, 'chat');
    Chats.find({email: req.body.email})
      .limit(50)
      .lean()
      .exec(function(e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/AddMessage',  utilis.verifyJWT,function(req, res, next) {
  try {
    var db = require('../schemas/chat.message');
    var Chats = db.Mongoose.model('chat', db.ChatSchema, 'chat');
    var newchat = new Chats({
      idChat: req.body.idChat,
      usuario_from: req.body.usuario_from,
      usuario_to: req.body.usuario_to,
      message: req.body.message,
      datahora: req.body.datahora,
      nome: req.body.nome,
    });
    newchat.save(function(err) {
      if (err) {
        res.status(500).json({error: err.message});
        res.end();
        return;
      }
      let socket = req.app.get('socketio');
      
      socket.emit('newMessage', req.body);
      res.json(newchat);
      res.end();
    });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/DeletePreviousMessages', utilis.verifyJWT, function(req, res, next) {
  try {    
    let LDate = new Date(req.body.datahora);
    var db = require('../schemas/chat.message');
    var Chats = db.Mongoose.model('chat', db.ChatSchema, 'chat');
    Chats.deleteMany()
      .where('datahora')
      .lt(LDate)
      .where('idChat')
      .equals(req.body.idChat)
      .lean()
      .exec(function(e, docs) {
        res.json(docs);
        res.end();
      });
  } catch (error) {
    res.json(error);
    res.end();
  }
});

module.exports = router;
