var express = require('express');
var cupons = require('../schemas/cupons');


var router = express.Router();
/* GET home page. */
router.post('/GetCupons', cupons.GetCupons);
router.post('/GetCupomByID', cupons.GetCupomByID);
router.post('/SaveCupom', cupons.SaveCupom);
router.post('/DeleteCupomByID', cupons.DeleteCupomByID);
router.post('/GetCupomByProductID', cupons.GetCupomByProductID);
router.post('/GetCupomByCODE', cupons.GetCupomByCODE);
router.post('/UpdateNumeroUtilizacao', cupons.UpdateNumeroUtilizacao);




module.exports = router;
