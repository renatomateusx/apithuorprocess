var express = require('express');
var utilis = require('./services/utilis');


var router = express.Router();
/* GET home page. */
router.post('/SendEmailBoleto', utilis.SendEmailBoleto);



module.exports = router;
