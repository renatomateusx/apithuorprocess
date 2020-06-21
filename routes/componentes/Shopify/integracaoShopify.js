var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utilis = require('../../../resources/util');
var usuario = require('../../../schemas/users');
var integracaoShopify = require('../../../schemas/integracaoPlataformas');
const format = require('string-format');
var constantes = require('../../../resources/constantes');
var utilis = require('../../../resources/util');
var produtosSchema = require('../../../schemas/produtos');
var fileSystem = require('fs');
var pathWay = require('path');
var apps = require('../../../schemas/apps');


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

router.post('/teste', function (req, res, next) {
  try {
    const url = "https://8e0a5928b377e6e822a30d5c2e9f0e25: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@ditecclube.myshopify.com/admin/api/2020-04/products.json";
    utilis.makeAPICallExternalHTTPS(url)
      .then((retorno) => {
        console.log(retorno[0])
        res.json({ mensagem: retorno[0]});
      });
  }
  catch (error) {
    console.log("Erro", error);
  }
})

router.post('/ImportarProdutosShopify', utilis.verifyJWT, function (req, res, next) {
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
            const url = format("https://{}:{}@{}/admin/api/{}/{}.json?limit=50", chave_api_key, senha, url_loja, versao, resourceProdutos);
            console.log(url);
            utilis.makeAPICallExternalHTTPS(url)
              .then((retorno) => {
                console.log(retorno[0]);
                processaListaProdutos(retorno[0], req, res, next, 1);
                tratarRepostaPaginacao(url, retorno[1], req, res, next, 1);
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



function processaListaProdutos(produtos, req, res, next, plataforma) {
  const prod = JSON.parse(produtos);
  var prods = prod.products;
  if (prods) {
    prods.forEach((obj, i) => {
      InsereProduto(obj, req, res, next, plataforma);
    });
    //res.json({ mensagem: 'Ok' });
    //res.end();
  }
}

function processaWebHooks(req, res, next, url, path, headerAditional, valueHeaderAditional) {
  return new Promise((resolve, reject) => {
    try {
      arrayWebHooks.forEach((json, i) => {
        //console.log("WebHook Criado ", json);
        utilis.makeAPICallExternalParamsJSON(url, path, json, headerAditional, valueHeaderAditional)
          .then(produtos => {
            console.log("WebHook Criado ", json.webhook.topic);
            ///res.json({ mensagem: "Ok!" });
            ///res.end();
          })
          .catch(error => {
            console.log("Erro ao criar webhooks", error);
            reject(error);
          })
      });
      resolve("ok");
    }
    catch (error) {
      reject(error);
    }
  })


}

function getTemplateThuorSnippet() {
  return new Promise((resolve, reject) => {
    try {
      var pathFile = pathWay.join(__dirname, '../../../public/templateThuorSnippet.text');

      var data = fileSystem.readFileSync(pathFile, 'utf8');
      resolve(data.toString());

    } catch (error) {
      reject(error);
    }
  });
}

function getTemplateThuorReviewSnippet() {
  return new Promise((resolve, reject) => {
    try {
      var pathFile = pathWay.join(__dirname, '../../../public/templates/template_review.html');

      var data = fileSystem.readFileSync(pathFile, 'utf8');
      resolve(data.toString());

    } catch (error) {
      reject(error);
    }
  });
}

function getTemplateThuorParcelAppTemplate() {
  return new Promise((resolve, reject) => {
    try {
      var pathFile = pathWay.join(__dirname, '../../../public/templateThuorParcelSnippet.text');

      var data = fileSystem.readFileSync(pathFile, 'utf8');
      resolve(data.toString());

    } catch (error) {
      reject(error);
    }
  });
}

function processaTemas(req, res, next, url, path, headerAditional, valueHeaderAditional) {
  return new Promise((resolve, reject) => {
    try {
      utilis.makeAPICallExternalHeaders(url, path, headerAditional, valueHeaderAditional)
        .then(retorno => {
          //console.log("WebHook Criado ", url + path);
          var LTemas = JSON.parse(retorno);

          LTemas.themes.forEach((tema, i) => {
            if (tema.role === "main") {
              getTemplateThuorSnippet()
                .then((retornoTemplate) => {

                  var LThemeID = tema.id;
                  var LAssets = "assets.json";
                  var PathAsset = path.replace(".json", "") + "/" + LThemeID + "/" + LAssets;
                  var body = {
                    "asset": {
                      "key": '' + constantes.RESOURCE_THUOR_SPNIPPET_LIQUID + '',
                      "value": retornoTemplate
                    }
                  }
                  //CHAMA FUNÇÃO PARA CRIAR O ARQUIVO ThuorSnippet.liquid
                  utilis.makeAPICallExternalParamsJSON(url, PathAsset, body, headerAditional, valueHeaderAditional, 'PUT')
                    .then(retornoAssets => {
                      //res.json({ mensagem: retornoAssets });
                      //https://kingofertas.myshopify.com/admin/api/2020-04/themes/95439847483/assets.json?asset[key]=layout/theme.liquid
                      var LThemeLiquid = PathAsset + "?asset[key]=" + constantes.RESOURCE_THUOR_THEME_LIQUID;
                      var LThemeBak = {
                        "asset": {
                          "key": 'layout/theme_edited_by_thuor.liquid',
                          "source_key": "layout/theme.liquid"
                        }
                      }
                      ///CHAMA API PARA FAZER BACKUP DO THEME.LIQUID             
                      utilis.makeAPICallExternalParamsJSON(url, PathAsset, LThemeBak, headerAditional, valueHeaderAditional, 'PUT')
                        .then(retornoBackup => {
                          // res.json({ mensagem: retornoBackup });
                          utilis.makeAPICallExternalHeaders(url, LThemeLiquid, body, headerAditional, valueHeaderAditional)
                            .then(retornoGetThemeLiquid => {
                              var LRet = JSON.parse(retornoGetThemeLiquid);
                              var OLDValue = LRet.asset.value.replace(constantes.RESOURCE_THUOR_THEME_LIQUID_EDIT_CONTENT, '</body>');
                              OLDValue = OLDValue.replace(constantes.RESOURCE_THUOR_THEME_LIQUID_EDIT_CONTENT_YAMPI,"");
                              var LNewHTMLValue = OLDValue.replace('</body>', constantes.RESOURCE_THUOR_THEME_LIQUID_EDIT_CONTENT);
                              var LThemeEdited = {
                                "asset": {
                                  "key": 'layout/theme.liquid',
                                  "value": LNewHTMLValue
                                }
                              }
                              //CHAMA API PARA ESCREVER O NOVO VALUR INCLUINDO A CHAMADA DO SNIPPET TO THUOR NO ARQUIVO THEME.LIQUID
                              utilis.makeAPICallExternalParamsJSON(url, PathAsset, LThemeEdited, headerAditional, valueHeaderAditional, 'PUT')
                                .then(retornoEdicaoArquivo => {
                                  resolve({ mensagem: retornoEdicaoArquivo });
                                })
                                .catch(error => {
                                  console.log("Erro ao EDITAR O ARQUIVO THEME.LIQUID ", error);
                                })

                            })
                            .catch(error => {
                              console.log("Error", error);
                            })
                        })
                        .catch(error => {
                          console.log("Error", error);
                        })
                    })
                    .catch(error => {
                      console.log("Error", error);
                    })
                })
                .catch((error) => {
                  console.log("Erro ao pegar o template ThuorSnippet", error);
                })

            }

          });
          //res.end();
        })
        .catch(error => {
          console.log("Erro ao processar temas", error);
        })
    }
    catch (error) {
      reject(error);
    }
  })

}

function processaTemasReviewApp(req, res, next, url, path, headerAditional, valueHeaderAditional) {
  utilis.makeAPICallExternalHeaders(url, path, headerAditional, valueHeaderAditional)
    .then(retorno => {
      //console.log("WebHook Criado ", url + path);
      var LTemas = JSON.parse(retorno);

      LTemas.themes.forEach((tema, i) => {
        if (tema.role === "main") {
          getTemplateThuorReviewSnippet()
            .then((retornoTemplate) => {

              var LThemeID = tema.id;
              var LAssets = "assets.json";
              var PathAsset = path.replace(".json", "") + "/" + LThemeID + "/" + LAssets;
              var body = {
                "asset": {
                  "key": '' + constantes.RESOURCE_THUOR_SPNIPPET_REVIEW_LIQUID + '',
                  "value": retornoTemplate
                }
              }
              //CHAMA FUNÇÃO PARA CRIAR O ARQUIVO ThuorReviewSnippet.liquid
              utilis.makeAPICallExternalParamsJSON(url, PathAsset, body, headerAditional, valueHeaderAditional, 'PUT')
                .then(retornoAssets => {
                  //res.json({ mensagem: retornoAssets });
                  //https://kingofertas.myshopify.com/admin/api/2020-04/themes/95439847483/assets.json?asset[key]=layout/theme.liquid
                  var LProductLiquid = PathAsset + "?asset[key]=" + constantes.RESOURCE_THUOR_PRODUCT_LIQUID;
                  var LProductLiquidBak = {
                    "asset": {
                      "key": 'templates/product_theme_edited_by_thuor_review_app.liquid',
                      "source_key": "templates/product.liquid"
                    }
                  }
                  ///CHAMA API PARA FAZER BACKUP DO PRODUCT.LIQUID             
                  utilis.makeAPICallExternalParamsJSON(url, PathAsset, LProductLiquidBak, headerAditional, valueHeaderAditional, 'PUT')
                    .then(retornoBackup => {
                      // res.json({ mensagem: retornoBackup });
                      utilis.makeAPICallExternalHeaders(url, LProductLiquid, body, headerAditional, valueHeaderAditional)
                        .then(retornoGetProductLiquid => {
                          var LRet = JSON.parse(retornoGetProductLiquid);
                          //console.log("LRet", LRet.asset.value);
                          var word = "{% endif %}";
                          var OLDValue = LRet.asset.value.replace(constantes.RESOURCE_THUOR_PRODUCT_LIQUID_EDIT_CONTENT, "");
                          LHT = OLDValue + constantes.RESOURCE_THUOR_PRODUCT_LIQUID_EDIT_CONTENT;
                          //console.log(LHT);
                          //var OLDValue = LRet.asset.value.replace(constantes.RESOURCE_THUOR_PRODUCT_LIQUID_EDIT_CONTENT, '{% endif %}');
                          var LNewHTMLValue = LHT;
                          var LProductThemeEdited = {
                            "asset": {
                              "key": 'templates/product.liquid',
                              "value": LNewHTMLValue
                            }
                          }
                          //CHAMA API PARA ESCREVER O NOVO VALUR INCLUINDO A CHAMADA DO SNIPPET TO THUOR NO ARQUIVO THEME.LIQUID
                          utilis.makeAPICallExternalParamsJSON(url, PathAsset, LProductThemeEdited, headerAditional, valueHeaderAditional, 'PUT')
                            .then(retornoEdicaoArquivo => {
                              res.json({ mensagem: retornoEdicaoArquivo });
                            })
                            .catch(error => {
                              console.log("Erro ao EDITAR O ARQUIVO PRODUCT.LIQUID ", error);
                            })

                        })
                        .catch(error => {
                          console.log("Error", error);
                        })
                    })
                    .catch(error => {
                      console.log("Error", error);
                    })
                })
                .catch(error => {
                  console.log("Error", error);
                })
            })
            .catch((error) => {
              console.log("Erro ao pegar o template ThuorSnippet", error);
            })

        }

      });
      //res.end();
    })
    .catch(error => {
      console.log("Erro ao processar temas", error);
    })

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

function tratarRepostaPaginacao(urlParams, headers, req, res, next, plataforma) {
  var Llink = headers['link'];
  if (Llink && Llink.indexOf('next') > -1) {
    var urlLocal = Llink.replace('<', '');
    urlLocal = urlLocal.replace('>', '');
    var urlLoc = new URL(urlLocal);
    var pageInfo = urlLoc.searchParams.get("page_info");
    var URLFinal = urlParams + "&page_info=" + pageInfo;
    utilis.makeAPICallExternalHTTPS(URLFinal)
      .then((retorno) => {
        processaListaProdutos(retorno[0], req, res, next, plataforma);
        tratarRepostaPaginacao(urlParams, retorno[1], req, res, next, plataforma);
      })
      .catch((error) => {
        console.log("Erro ao tentar pegar, pelo tratarRespostaPaginacao, o próximo registro", error);
      })
  }
  else {
    res.json({ mensagem: 'Ok' });
    res.end();
  }
}

router.post('/ReInstalarIntegracao', function (req, res, next) {
  try {
    const { id_usuario } = req.body;
    req.body.id = id_usuario;
    usuario.GetUserByID(req, res, next)
      .then(userInfo => {
        req.body.id_usuario = id_usuario;
        integracaoShopify.GetIntegracaoShopifyCheckout(req, res, next)
          .then(async integraShopify => {
            const url_loja = integraShopify[0].url_loja;
            const chave_api_key = integraShopify[0].chave_api_key;
            const senha = integraShopify[0].senha;
            const segredo_compartilhado = integraShopify[0].segredo_compartilhado;
            const versao = constantes.VERSAO_API;
            const resourceWebHooks = constantes.RESOURCE_WEBHOOKS;
            const resourceTemas = constantes.RESOURCE_TEMAS;

            //url = "https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json";
            const url = format("https://{}:{}@{}", chave_api_key, senha, url_loja);
            const path = format("/admin/api/{}/{}.json", versao, resourceWebHooks)
            var headerAditional = "X-Shopify-Access-Token";
            var valueHeaderAditional = senha;
            const LWebHook = await processaWebHooks(req, res, next, url, path, headerAditional, valueHeaderAditional);
            var PathTemas = format("/admin/api/{}/{}.json", versao, resourceTemas);
            const LProcessThemes = await processaTemas(req, res, next, url, PathTemas, headerAditional, valueHeaderAditional);
            const LApp = await apps.SaveAppInternal(url_loja, id_usuario, 1, 2);
            res.json({ mensagem: 'Aplicação Instalada' });
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


router.post('/InstalarAppReview', function (req, res, next) {
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
            const resourceTemas = constantes.RESOURCE_TEMAS;

            //url = "https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json";
            const url = format("https://{}:{}@{}", chave_api_key, senha, url_loja);
            const path = format("/admin/api/{}/{}.json", versao, resourceWebHooks)
            var headerAditional = "X-Shopify-Access-Token";
            var valueHeaderAditional = senha;
            var PathTemas = format("/admin/api/{}/{}.json", versao, resourceTemas);
            processaTemasReviewApp(req, res, next, url, PathTemas, headerAditional, valueHeaderAditional);
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

router.post('/InstalarAppThuorParcel', function (req, res, next) {
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
            const resourceTemas = constantes.RESOURCE_TEMAS;

            //url = "https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json";
            const url = format("https://{}:{}@{}", chave_api_key, senha, url_loja);
            const path = format("/admin/api/{}/{}.json", versao, resourceWebHooks)
            var headerAditional = "X-Shopify-Access-Token";
            var valueHeaderAditional = senha;
            var PathTemas = format("/admin/api/{}/{}.json", versao, resourceTemas);
            processaTemasParcelApp(req, res, next, url, PathTemas, headerAditional, valueHeaderAditional);
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


function processaTemasParcelApp(req, res, next, url, path, headerAditional, valueHeaderAditional) {
  utilis.makeAPICallExternalHeaders(url, path, headerAditional, valueHeaderAditional)
    .then(retorno => {
      //console.log("WebHook Criado ", url + path);
      var LTemas = JSON.parse(retorno);
      const { id_usuario } = req.body;
      LTemas.themes.forEach((tema, i) => {
        if (tema.role === "main") {
          getTemplateThuorParcelAppTemplate()
            .then((retornoTemplate) => {

              var LThemeID = tema.id;
              var LAssets = "assets.json";
              var PathAsset = path.replace(".json", "") + "/" + LThemeID + "/" + LAssets;
              var body = {
                "asset": {
                  "key": '' + constantes.RESOURCE_THUOR_SPNIPPET_PARCEL_LIQUID + '',
                  "value": retornoTemplate.replace("{id_usuario}", id_usuario)
                }
              }
              //CHAMA FUNÇÃO PARA CRIAR O ARQUIVO ThuorParcelSnippet.liquid
              utilis.makeAPICallExternalParamsJSON(url, PathAsset, body, headerAditional, valueHeaderAditional, 'PUT')
                .then(retornoAssets => {
                  //res.json({ mensagem: retornoAssets });
                  //https://kingofertas.myshopify.com/admin/api/2020-04/themes/95439847483/assets.json?asset[key]=layout/theme.liquid
                  var LProductLiquid = PathAsset + "?asset[key]=" + constantes.RESOURCE_THUOR_APP_PARCEL_PRODUCT_LIQUID;
                  var LProductLiquidBak = {
                    "asset": {
                      "key": 'templates/product_theme_edited_by_thuor_parcel_app.liquid',
                      "source_key": "sections/product.liquid"
                    }
                  }
                  ///CHAMA API PARA FAZER BACKUP DO PRODUCT.LIQUID             
                  utilis.makeAPICallExternalParamsJSON(url, PathAsset, LProductLiquidBak, headerAditional, valueHeaderAditional, 'PUT')
                    .then(retornoBackup => {
                      // res.json({ mensagem: retornoBackup });
                      utilis.makeAPICallExternalHeaders(url, LProductLiquid, body, headerAditional, valueHeaderAditional)
                        .then(retornoGetProductLiquid => {
                          var LRet = JSON.parse(retornoGetProductLiquid);
                          //console.log("LRet", LRet.asset.value);
                          var OLDValue = LRet.asset.value.replace(constantes.RESOURCE_THUOR_PARCEL_APP_PRODUCT_LIQUID_EDIT_CONTENT, "");
                          var n = OLDValue.lastIndexOf(word);
                          LHT = OLDValue + constantes.RESOURCE_THUOR_PARCEL_APP_PRODUCT_LIQUID_EDIT_CONTENT;
                          //console.log(LHT);
                          //var OLDValue = LRet.asset.value.replace(constantes.RESOURCE_THUOR_PRODUCT_LIQUID_EDIT_CONTENT, '{% endif %}');
                          var LNewHTMLValue = LHT;
                          var LProductThemeEdited = {
                            "asset": {
                              "key": 'sections/product.liquid',
                              "value": LNewHTMLValue
                            }
                          }
                          //CHAMA API PARA ESCREVER O NOVO VALUR INCLUINDO A CHAMADA DO SNIPPET TO THUOR NO ARQUIVO THEME.LIQUID
                          utilis.makeAPICallExternalParamsJSON(url, PathAsset, LProductThemeEdited, headerAditional, valueHeaderAditional, 'PUT')
                            .then(retornoEdicaoArquivo => {
                              res.json({ mensagem: retornoEdicaoArquivo });
                            })
                            .catch(error => {
                              console.log("Erro ao EDITAR O ARQUIVO PRODUCT-TEMPLATE.LIQUID ", error);
                            })

                        })
                        .catch(error => {
                          console.log("Error", error);
                        })
                    })
                    .catch(error => {
                      console.log("Error", error);
                    })
                })
                .catch(error => {
                  console.log("Error", error);
                })
            })
            .catch((error) => {
              console.log("Erro ao pegar o template ThuorSnippet", error);
            })

        }

      });
      //res.end();
    })
    .catch(error => {
      console.log("Erro ao processar temas", error);
    })

}

module.exports = router;