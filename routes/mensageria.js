var express = require('express');
var mensageria = require('../schemas/mensageria');


var router = express.Router();
/* GET home page. */
router.post('/GetMensagens', mensageria.GetMensagens);
router.post('/SaveMensagem', mensageria.SaveMensagem);
router.post('/DeleteMensagensByID', mensageria.DeleteMensagensByID);
router.post('/GetMensagemByID', mensageria.GetMensagemByID);
router.post('/GetMensagensWhatsApp', mensageria.GetMensagensWhatsApp);


module.exports = router;
