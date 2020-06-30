var express = require('express');
var router = express.Router();
var utilis = require('../resources/util');
var extras = require('../schemas/extras');
const fs = require('fs');
const path = require("path");
var pool = require('../db/queries');

var done = false;
router.post('/ViaCEP', async function (req, res, next) {
  try {
    let LCep = req.body.cep;
    const LRetorno = await extras.GetCEP(LCep);
    res.json(LRetorno);
    res.end();

  } catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/ProcessaLOG', async function (req, res, next) {
  try {
    const LArray = [];
    var template = path.resolve('public/logradouro.json');
    var LHTML = '';
    fs.readFile(template, 'utf8', async function (err, json) {
      if (err) {
        throw err;
      }
      json = JSON.parse(json);
      if (json) {
        if (json.RECORDS.length > 0) {

          json.RECORDS.forEach(async (obj, i) => {
            /*const lret = await processaLogradouro(obj);*/
            processaLogradouro(obj)
          })

          res.json('ok');
          res.end();
        }
      }
    });
  }
  catch (error) {
    res.json(error);
    res.end();
  }
})


router.post('/CountLog', async function (req, res, next) {
  try {
    const { obj } = req.body;
    const lret = await countLogGeral(obj);
    res.json(lret);
    res.end();
  }
  catch (error) {
    res.json(error);
    res.end();
  }
});

router.post('/ProcessaLOGComplelmento', async function (req, res, next) {
  try {
    var template = path.resolve('public/complemento.json');
    var LHTML = '';
    fs.readFile(template, 'utf8', async function (err, json) {
      if (err) {
        throw err;
      }
      json = JSON.parse(json);
      if (json) {
        if (json.RECORDS.length > 0) {
          json.RECORDS.forEach(async (obj, i) => {
            const lret = await processaLogradouroComplemento(obj);
          })
          res.json('ok');
          res.end();
        }
      }
    });
  }
  catch (error) {
    res.json(error);
    res.end();
  }
})

function processaLogradouro(obj) {
  return new Promise((resolve, reject) => {
    try {
      pool.query('INSERT INTO tbl_cep_202005_n_log (cep, tipo, nome_logradouro, logradouro, bairro_id, cidade_id, estado, tipo_sem_acento, nome_logradouro_sem_acento, logradouro_sem_acento, latitude, longitude, cep_ativo, up) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT (cep) DO UPDATE SET cep=$1, tipo=$2, nome_logradouro=$3, logradouro=$4, bairro_id=$5, cidade_id=$6, estado=$7, tipo_sem_acento=$8, nome_logradouro_sem_acento=$9, logradouro_sem_acento=$10, latitude=$11, longitude=$12, cep_ativo=$13, up=$14', [obj.cep, obj.tipo, obj.nome_logradouro, obj.logradouro, obj.bairro_id, obj.cidade_id, obj.estado, obj.tipo_sem_acento, obj.nome_logradouro_sem_acento, obj.logradouro_sem_acento, obj.latitude, obj.longitude, obj.cep_ativo, obj.up], (error, results) => {
        if (error) {
          throw error
        }
        resolve(1);
      });
    }
    catch (error) {
      reject(error);
    }
  })
}

function countLogGeral(obj) {
  return new Promise((resolve, reject) => {
    try {
      pool.query('select count(*) from ' + obj, (error, results) => {
        if (error) {
          throw error
        }
        resolve(results.rows);
      });
    }
    catch (error) {
      reject(error);
    }
  })
}

function processaBulk(obj) {
  return new Promise((resolve, reject) => {
    try {
      pool.query('INSERT INTO tbl_cep_202005_n_log (cep, tipo, nome_logradouro, logradouro, bairro_id, cidade_id, estado, tipo_sem_acento, nome_logradouro_sem_acento, logradouro_sem_acento, latitude, longitude, cep_ativo, up) VALUES ($1)', [obj], (error, results) => {
        if (error) {
          throw error
        }
        resolve(1);
      });
    }
    catch (error) {
      reject(error);
    }
  })
}



function processaLogradouroComplemento(obj) {
  return new Promise((resolve, reject) => {
    try {
      pool.query('INSERT INTO tbl_cep_202005_n_log_complemento (cep, complemento, complemento_sem_acento) VALUES ($1,$2,$3) ON CONFLICT (cep) DO UPDATE SET cep=$1, complemento=$2, complemento_sem_acento=$3', [obj.cep, obj.complemento, obj.complemento_sem_acento], (error, results) => {
        if (error) {
          throw error
        }
        resolve(1);
      });
    }
    catch (error) {
      reject(error);
    }
  })
}


module.exports = router;
