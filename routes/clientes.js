var express = require('express');
var clientes = require('../schemas/clientes');


var router = express.Router();
/* GET home page. */
router.post('/GetClientes', clientes.GetClientes);
router.post('/SaveClientes', clientes.SaveClientes);
router.post('/DeleteClienteByID', clientes.DeleteClienteByID);
router.post('/GetClienteByID', clientes.GetClienteByID);
router.post('/SaveLead', clientes.SaveLead);



module.exports = router;
