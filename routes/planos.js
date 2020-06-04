var express = require('express');
var planos = require('../schemas/planos');


var router = express.Router();
/* GET home page. */
router.post('/GetPlanos', planos.GetPlanos);
router.post('/GetPlanosByID', planos.GetPlanosByID);



module.exports = router;
