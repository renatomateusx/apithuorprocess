var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');

router.get('/', utilis.verifyJWT, function (req, res, next) {
    try {        
        var db = require('../schemas/chat.list');
        var ChatsList = db.Mongoose.model('chatlist', db.ChatListSchema, 'chatlist');
        ChatsList
            .find()
            .sort({'datahora': 'desc'})
            .lean().exec(function (e, docs) {
            res.json(docs);
            res.end();
        });
    } catch (error) {
        res.json(error);
        res.end();
    }
});

router.post('/GetChatList', utilis.verifyJWT, function (req, res, next) {
    try {        
        var db = require('../schemas/chat.list');
        var ChatsList = db.Mongoose.model('chatlist', db.ChatListSchema, 'chatlist');
        ChatsList
            .find()            
            .where('idChat').regex(req.body.idChat)
            .sort({'datahora': 'desc'})
            .lean().exec(function (e, docs) {
            res.json(docs);
            res.end();
        });
    } catch (error) {
        res.json(error);
        res.end();
    }
});
/* Get Chat ID */
router.post('/GetChatByIDChat', utilis.verifyJWT, function (req, res, next) {
    try {
        var db = require('../schemas/chat.list');
        var ChatsList = db.Mongoose.model('chatlist', db.ChatListSchema, 'chatlist');
        ChatsList.find()
            .where('idchat').equals(req.body.idChat)
            .sort({'datahora': 'asc'})
            .lean().exec(function (e, docs) {
                res.json(docs);
                res.end();
            });
    } catch (error) {
        res.json(error);
        res.end();
    }
});

/* Get Chat ID */
router.post('/CreateChatList', utilis.verifyJWT, function (req, res, next) {
    try {        
        var db = require('../schemas/chat.list');
        var ChatsList = db.Mongoose.model('chatlist', db.ChatListSchema, 'chatlist');
        var newchatlist = new ChatsList({
            idChat: req.body.idChat,
            lastmessage: req.body.lastmessage,
            datahora: req.body.datahora
        });
        newchatlist.save(function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                res.end();
                return;
            }
            res.json(newchatlist);
            res.end();
        });
    } catch (error) {
        console.log('error', error);
        res.json(error);
        res.end();
    }
});

router.put('/SetaUltimaMensagemChat', utilis.verifyJWT, function (req, res, next) {
    try {        
        var db = require('../schemas/chat.list');
        var ChatsList = db.Mongoose.model('chatlist', db.ChatListSchema, 'chatlist');
        ChatsList.updateOne({ idChat: req.body.idChat }, req.body, { upsert: true }, function (err, doc) {
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


router.put('/UpdateChatList', utilis.verifyJWT, function (req, res, next) {
    try {
        var db = require('../schemas/chat.list');
        var ChatsList = db.Mongoose.model('chatlist', db.ChatListSchema, 'chatlist');
        ChatsList.updateOne({ _id: req.body.id }, req.body, { upsert: true }, function (err, doc) {
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