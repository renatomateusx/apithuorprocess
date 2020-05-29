var express = require('express');
var apps = require('../schemas/apps');


var router = express.Router();
/* GET home page. */
router.post('/GetApps', apps.GetApps);
router.post('/GetStatusApp', apps.GetStatusApp);
router.post('/SaveApps', apps.SaveApp);
router.post('/GetAppByID', apps.GetAppByID);


module.exports = router;
