var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var mensalidadesSchema = require('../schemas/mensalidades');

/* GET home page. */
router.post('/GetMensalidadesPagas', mensalidadesSchema.GetMensalidadesPagas);
router.post('/insereTransacaoInternaMensalidades', mensalidadesSchema.insereTransacaoInternaMensalidades);
router.post('/GetMensalidadesByID', mensalidadesSchema.GetMensalidadesByID);


module.exports = router;
