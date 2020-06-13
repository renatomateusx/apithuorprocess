var express = require('express');
var ajudaSchema = require('../schemas/ajuda');
var router = express.Router();


/* GET home page. */
router.post('/GetAjuda', ajudaSchema.GetAjuda);
router.post('/SaveAjuda', ajudaSchema.SaveAjuda);
router.post('/GetAjudaByID', ajudaSchema.GetAjudaByID);
router.post('/DeleteAjudaByID', ajudaSchema.DeleteAjudaByID);

module.exports = router;
