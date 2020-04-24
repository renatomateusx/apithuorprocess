var jwt = require('jsonwebtoken');
var request = require('request');
const https = require('https');
const querystring = require('querystring');
/*DEIXEI COMENTADO PARA COLOCAR, SE FOR PRECISO, NO ARQUIVO VIEWS/LAYOUT.PUG script(src='https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js')*/
module.exports.verifyJWT = function (req, res, next) {
  var token = req.headers['authorization'];
  if (!token)
    return res
      .status(401)
      .send({ auth: false, message: 'Nenhum token enviado.' });
  var LToken = token.split(' ');
  jwt.verify(LToken[1], process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(401)
        .send({ auth: false, message: 'Falha ao autenticar token.' });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
};

module.exports.makeAPICallExternal = function (url) {
  return new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });
};

module.exports.makeAPICallExternalHTTPS = function (url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        var retorno =[data, resp.headers];
        resolve(retorno);
      });

    }).on("error", (err) => {
      reject(err.message);
    });
  });
};

module.exports.makeAPICallExternalParams = function (url, body) {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        uri: url,
        body: body,
        method: 'POST',
      },
      function (err, res, body) {
        if (err) reject(err);
        resolve(body);
      }
    );
  });
};

module.exports.makeAPICallExternalParamsJSON = function (url, path, body, headerAdditional, valueHeaderAditional) {
  return new Promise((resolve, reject) => {
    //console.log("Body", body);
    var postData = querystring.stringify(body);

    request(
      {
        headers: {
          'Content-Type': 'application/json',
          headerAdditional: valueHeaderAditional
        },
        uri: url + path,
        body: JSON.stringify(body),
        method: 'POST',
      },
      function (err, res, body) {
        if (err) reject(err);
        resolve(body);
      }
    );

  });
};

module.exports.formatJsonData = function (dados) {
  let retorno = '';
  if (dados !== null) {
    const keys = Object.keys(dados);
    const tamanho = keys.length;
    keys.forEach((elem, index) => {
      retorno += elem + '=' + dados[elem];
      if (index < tamanho - 1) {
        retorno += '&';
      }
    });
    retorno = encodeURI(retorno);
  }
  return retorno;
};


module.exports.loadExternalJavaScriptFile = function (url) {
  return new Promise((resolve, reject) => {
    request({ uri: url, method: 'GET' },
      function (err, res, body) {
        if (err) reject(err);
        resolve(body);
      })

  });
};
