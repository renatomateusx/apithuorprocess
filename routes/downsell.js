var express = require('express');
var downsells = require('../schemas/downsells');


var router = express.Router();
/* GET home page. */
router.post('/GetDownsells', downsells.GetDownsells);
router.post('/GetDownsellsByID', downsells.GetDownsellsByID);
router.post('/SaveDownsells', downsells.SaveDownsells);
router.post('/DeleteDownSellByID', downsells.DeleteDownSellByID);
router.post('/GetDownSellByProductID', downsells.GetDownSellByProductID);
router.post('/GetDownSellByStorePageOrCartPage', downsells.GetDownSellByStorePageOrCartPage);




module.exports = router;
