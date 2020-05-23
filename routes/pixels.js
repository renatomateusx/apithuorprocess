var express = require('express');
var pixels = require('../schemas/pixels');


var router = express.Router();
/* GET home page. */
router.post('/GetPixels', pixels.GetPixels);
router.post('/SavePixels', pixels.SavePixels);
router.post('/DeletePixelByID', pixels.DeletePixelByID);
router.post('/GetPixelByID', pixels.GetPixelByID);


module.exports = router;
