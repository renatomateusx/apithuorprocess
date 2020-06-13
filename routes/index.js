var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
const PUBLIC_VAPID =
  'BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg';
const PRIVATE_VAPID = '_kRzHiscHBIGftfA7IehH9EA3RvBl8SBYhXBAMz6GrI';
/* GET home page. */
router.get('/', function (req, res, next) {
  let socket = req.app.get('socketio');
  //socket.emit('newrequest', req.body);
  
  res.send('/index');
});

router.get('/status',function (req, res, next) {
  
  
  res.send('Status OK!');
});

router.get('/newNotification', function (req, res, next) {
  let socket = req.app.get('socketio');
  socket.emit('newNotification', req.body);

  res.send('/newNotification');
});

module.exports = router;
