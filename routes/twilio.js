var express = require('express');
var twilio = require('../schemas/twilio');
const constantes = require('../resources/constantes');
var router = express.Router();

router.post('/SendSMS', function(req, res, next){
    twilio.SendSMS('Opa', constantes.TWILIO_NUMBER, '+5571991306561')
    .then((rses)=>{
        res.json(1);
        res.end();
    })
    //twilio.SendWhatsApp('Opa', constantes.TWILIO_WHATS_APP_NUMBER, '+5571991306561');
});

router.post('/SendWhatsApp', function(req, res, next){
    //twilio.SendSMS('Opa', constantes.TWILIO_NUMBER, '+5571991306561');
    twilio.SendWhatsApp('Your {{1}} code is {{2}}', constantes.TWILIO_WHATS_APP_NUMBER, '+5571991306561')
    .then((rses)=>{
        res.json(1);
        res.end();
    })
});


module.exports = router;