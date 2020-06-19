var express = require('express');
var apps = require('../schemas/apps');


var router = express.Router();
/* GET home page. */
router.post('/GetApps', apps.GetApps);
router.post('/GetAppByID', apps.GetAppByID);
router.post('/GetStatusApp', apps.GetStatusApp);
router.post('/GetIntegracaoApps', apps.GetIntegracaoApps);
router.post('/SaveApps', apps.SaveApp);



module.exports = router;
