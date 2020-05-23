var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');

router.post('/NotificaBoleto', function (req, res, next) {
    console.log("Body", req.body);
});


module.exports = router;