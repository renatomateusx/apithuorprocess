var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../resources/util');
var usersSchema = require('../schemas/users');

/* User Pagination */
//utilis.verifyJWT, --- COLOCAR ISSO EM TODOS QUE PRECISAM.
router.get('/GetUsers', usersSchema.GetUsers);

router.get('/SolicitarProposta', usersSchema.SolicitarProposta);

router.post('/GetUserByProfile', utilis.verifyJWT, usersSchema.GetUserByProfile);

router.post('/GetUserByID', usersSchema.GetUserByID);

router.post('/EfetuaLogin', usersSchema.EfetuaLogin);

router.post('/AddUser', usersSchema.AddUser);

router.post('/AtivacaoEmail', usersSchema.EnviaAtivacaoEmail);

router.post('/RedefinirSenha', usersSchema.VerificaRedefineSenha);


router.post('/AtivarEmail', usersSchema.AtivarEmail);

router.get('/VerificaToken', function (req, res, next) {
  var token = req.headers['authorization'];
  if (!token)
    return res
      .status(401)
      .send({ auth: false, message: 'Nenhum token enviado.' });

  var LToken = token.split(' ');
  jwt.verify(LToken[1], process.env.SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ auth: false, message: 'Falha ao autenticar token.' });
    }
    res.status(200).json(decoded);
  });
});

module.exports = router;