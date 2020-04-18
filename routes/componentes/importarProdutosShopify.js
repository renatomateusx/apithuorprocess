var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../../resources/util');
var pool = require('../../db/queries');
var usuario = require('../../schemas/users');
var integracaoShopify = require('../../schemas/integracaoShopify');
const format = require('string-format');
var constantes = require('../../resources/constantes');
var utilis = require('../../resources/util');
var produtosSchema = require('../../schemas/produtos');
const arrayWebHooks = [
  {
    "webhook": {
      "topic": "orders/create",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  },
  {
    "webhook": {
      "topic": "orders/update",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  },
  {
    "webhook": {
      "topic": "products/create",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  },
  {
    "webhook": {
      "topic": "products/update",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  },
  {
    "webhook": {
      "topic": "products/delete",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  },
  {
    "webhook": {
      "topic": "refunds/create",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  },
  {
    "webhook": {
      "topic": "customers/create",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  },
  {
    "webhook": {
      "topic": "customers/update",
      "address": constantes.WEBSITEAPI,
      "format": "json"
    }
  }
]

router.post('/ImportarProdutosShopify', function (req, res, next) {
  try {
    const { id_usuario } = req.body;
    req.body.id = id_usuario;
    usuario.GetUserByID(req, res, next)
      .then(userInfo => {
        req.body.id_usuario = id_usuario;
        integracaoShopify.GetIntegracaoShopifyCheckout(req, res, next)
          .then(integraShopify => {
            const url_loja = integraShopify[0].url_loja;
            const chave_api_key = integraShopify[0].chave_api_key;
            const senha = integraShopify[0].senha;
            const segredo_compartilhado = integraShopify[0].segredo_compartilhado;
            const versao = constantes.VERSAO_API;
            const resourceProdutos = constantes.RESOURCE_PRODUCTS;

            //const URL_TESTE = 'https://fdfb548a78fd2d4b9481d92e0b185efe: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@kingofertas.myshopify.com/admin/api/2020-04/products.json';
            //console.log(URL_TESTE);
            //url = "https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json";
            const url = format("https://{}:{}@{}/admin/api/{}/{}.json", chave_api_key, senha, url_loja, versao, resourceProdutos);
            console.log(url);
            utilis.makeAPICallExternalHTTPS(url)
              .then(produtos => {
                processaListaProdutos(produtos, req, res, next);
              });
          })
          .catch(error => {
            console.log("Erro ao pegar dados da integração com o checkout da shopify", error);
          })

      })
      .catch(error => {
        console.log("Erro ao capturar o usuário pelo ID", error);
        reject(error);
      })

  } catch (error) {
    res.json(error);
    res.end();
  }
});

function processaListaProdutos(produtos, req, res, next) {
  const prod = JSON.parse(produtos);
  var prods = prod.products;
  prods.forEach((obj, i) => {
    InsereProduto(obj, req, res, next);
  });
  res.json({ mensagem: 'Ok' });
  res.end();
}

function processaWebHooks(req, res, next, url, path, headerAditional, valueHeaderAditional) {
  arrayWebHooks.forEach((json, i) => {
    //console.log("WebHook Criado ", json);
    utilis.makeAPICallExternalParamsJSON(url, path, json, headerAditional, valueHeaderAditional)
      .then(produtos => {
        console.log("WebHook Criado ", json.webhook.topic);
      })
      .catch(error =>{
        console.log("Erro ao criar webhooks", error);
      })
  });
  res.json({mensagem: "Ok!"});
  res.end();
}

function InsereProduto(produto, req, res, next) {
  return new Promise((resolve, reject) => {
    let _LProd = produto;
    req.body.id_produto_json = _LProd.id;
    req.body.json_dados_produto = _LProd;
    req.body.titulo_produto = _LProd.title;

    produtosSchema.AddProduto(req, res, next)
      .then(count => {
        resolve(count);
      })
      .catch(error => {
        console.log("Erro ao adicionar produto na base de dados", error);
        reject(error);
      })
  });
}

router.post('/ReInstalarIntegracao', function (req, res, next) {
  try {
    const { id_usuario } = req.body;
    req.body.id = id_usuario;
    usuario.GetUserByID(req, res, next)
      .then(userInfo => {
        req.body.id_usuario = id_usuario;
        integracaoShopify.GetIntegracaoShopifyCheckout(req, res, next)
          .then(integraShopify => {
            const url_loja = integraShopify[0].url_loja;
            const chave_api_key = integraShopify[0].chave_api_key;
            const senha = integraShopify[0].senha;
            const segredo_compartilhado = integraShopify[0].segredo_compartilhado;
            const versao = constantes.VERSAO_API;
            const resourceWebHooks = constantes.RESOURCE_WEBHOOKS;

            //url = "https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json";
            const url = format("https://{}:{}@{}", chave_api_key, senha, url_loja);
            const path = format("/admin/api/{}/{}.json", versao, resourceWebHooks)
            var headerAditional = "X-Shopify-Access-Token";
            var valueHeaderAditional = senha;
            processaWebHooks(req, res, next, url, path, headerAditional, valueHeaderAditional);

          })
          .catch(error => {
            console.log("Erro ao pegar dados da integração com o checkout da shopify", error);
          })

      })
      .catch(error => {
        console.log("Erro ao capturar o usuário pelo ID", error);
        reject(error);
      })

  } catch (error) {
    res.json(error);
    res.end();
  }
});


module.exports = router;