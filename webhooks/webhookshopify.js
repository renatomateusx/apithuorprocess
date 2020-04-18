var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var webhooksshopify = require('../schemas/webhooksshopify');

uter.get('/rotas', function (req, res, next) {
    try {
        console.log("WebHooks", res);
        console.log("Headers", req.headers);
    } catch (error) {
        res.json(error);
        res.end();
    }
});




module.exports = router;