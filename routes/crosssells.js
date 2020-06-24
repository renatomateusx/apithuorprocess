var express = require('express');
var crosssells = require('../schemas/crosssells');


var router = express.Router();
/* GET home page. */
router.post('/GetCrossSells', crosssells.GetCrossSells);
router.post('/GetCrossSellsByID', crosssells.GetCrossSellsByID);
router.post('/SaveCrossSells', crosssells.SaveCrossSells);
router.post('/DeleteCrossSellByID', crosssells.DeleteCrossSellByID);
router.post('/GetCrossSellByProductID', crosssells.GetCrossSellByProductID);
router.post('/GetCrossSellByStorePageOrCartPage', crosssells.GetCrossSellByStorePageOrCartPage);




module.exports = router;
