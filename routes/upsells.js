var express = require('express');
var uplsells = require('../schemas/upsells');


var router = express.Router();
/* GET home page. */
router.post('/GetUpSells', uplsells.GetUpSells);
router.post('/SaveUpSells', uplsells.SaveUpSells);
router.post('/DeleteUpSellByID', uplsells.DeleteUpSellByID);

module.exports = router;
