var pool = require('../db/queries');
var utils = require('../resources/util');
var constantes = require('../resources/constantes');
const format = require('string-format');
const DeferredPromise = require('@bitbar/deferred-promise');
const componenteShopify = require('../routes/componentes/Shopify/integracaoShopify');
const WebHookShopify = require('../webhooks/webhookshopify');
const produtos = require('../schemas/produtos');
const transacoes = require('../schemas/transacao');
const fulfillments = require('../schemas/fulfillments');
const produto = "produto_option_id[@]=#&";
const quantidade = "produto_option_quantity[@]=#&";
const produto_variante = "produto_option_variante_id[@]=#&";
const store = "store=#&";


module.exports.GetIntegracaoShopifyCheckout = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_usuario } = req.body;
            pool.query('SELECT * FROM integracoes_plataformas WHERE id_usuario=$1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows);

            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.AddIntegracaoShopifyCheckout = (req, res, next) => {
    try {
        const {
            status,
            auto_sincroniza,
            pula_carrinho,
            tipo_integracao,
            url_loja,
            chave_api_key,
            senha,
            segredo_compartilhado,
            quais_pedidos_enviar,
            id_usuario,
            plataforma,
            email_loja } = req.body;
        pool.query('INSERT INTO integracoes_plataformas (status, auto_sincroniza, pula_carrinho, tipo_integracao, url_loja, chave_api_key, senha, segredo_compartilhado, quais_pedidos_enviar, id_usuario, plataforma, email_loja) VALUES ($1, $2, $3,$4,$5,$6, $7, $8, $9, $10, $11,$12) ON CONFLICT (id_usuario, plataforma) DO UPDATE SET status=$1, auto_sincroniza=$2, pula_carrinho=$3, tipo_integracao=$4, url_loja=$5, chave_api_key=$6, senha=$7, segredo_compartilhado=$8, quais_pedidos_enviar=$9, id_usuario=$10, plataforma=$11, email_loja=$12',
            [status,
                auto_sincroniza,
                pula_carrinho,
                tipo_integracao,
                url_loja,
                chave_api_key,
                senha,
                segredo_compartilhado,
                quais_pedidos_enviar,
                id_usuario,
                plataforma,
                email_loja],
            (error, results) => {
                if (error) {
                    throw error
                }
                res.status(201).send(`Ok`);
            })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateIntegracaoShopifyCheckout = (req, res, next) => {
    try {
        const {
            id_usuario,
            id,
            status,
            auto_sincroniza,
            pula_carrinho,
            tipo_integracao,
            url_loja,
            chave_api_key,
            senha,
            segredo_compartilhado,
            quais_pedidos_enviar,
            email_loja } = req.body;
        pool.query('UPDATE integracoes_plataformas SET status=$1, auto_sincroniza=$2, pula_carrinho=$3, tipo_integracao=$4, url_loja=$5, chave_api_key=$6, senha=$7, segredo_compartilhado=$8, quais_pedidos_enviar=$9, email_loja=$12) WHERE id=$10 and id_usuario = $11',
            [status,
                auto_sincroniza,
                pula_carrinho,
                tipo_integracao,
                url_loja,
                chave_api_key,
                senha,
                segredo_compartilhado,
                quais_pedidos_enviar,
                id,
                id_usuario,
                email_loja],
            (error, results) => {
                if (error) {
                    throw error
                }
                res.status(201).send(`Ok`);
            })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.ReInstalarIntegracao = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("NÃO TÁ FAZENDO NADA");
        } catch (error) {
            reject(error);
        }
    });
}

function getDadosLoja(shop) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM integracoes_plataformas WHERE url_loja=$1', [shop], async (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows) {

                results.rows.forEach(async (obj, i) => {
                    resolve(obj);
                })

            }
        });
    });
}
module.exports.GetDadosLojaInternal = (shop) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM integracoes_plataformas WHERE url_loja=$1', [shop], async (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows) {

                results.rows.forEach(async (obj, i) => {
                    resolve(obj);
                })

            }
        });
    });
}
module.exports.GetDadosLoja = (req, res, next) => {
    //return new Promise((resolve, reject) => {
    try {
        const { shop } = req.body;

        pool.query('SELECT * FROM integracoes_plataformas WHERE url_loja=$1', [shop], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows) {

                results.rows.forEach((loja, i) => {
                    //console.log("Shop", loja);
                    res.json(loja);
                    res.end();
                })
            }
        });
    }
    catch (error) {
        console.log("Erro cart shopify", error);
        res.json(error);
        res.end();
        // reject(error);
    }
    //});
}
module.exports.GetDadosLojaByIDUsuario = (req, res, next) => {
    //return new Promise((resolve, reject) => {
    try {
        const { id_usuario } = req.body;

        pool.query('SELECT * FROM integracoes_plataformas WHERE id_usuario=$1', [id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows) {

                results.rows.forEach((loja, i) => {
                    //console.log("Shop", loja);
                    res.json(loja);
                    res.end();
                })
            }
        });
    }
    catch (error) {
        console.log("Erro cart shopify", error);
        res.json(error);
        res.end();
        // reject(error);
    }
    //});
}


module.exports.GetLojaByUsuario = (id_usuario) => {
    return new Promise((resolve, reject) => {
        try {           

            pool.query('SELECT * FROM integracoes_plataformas WHERE id_usuario=$1', [id_usuario], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rows) {

                    results.rows.forEach((loja, i) => {
                        //console.log("Shop", loja);
                        resolve(loja);
                    })
                }else{
                    resolve(0);
                }
            });
        }
        catch (error) {
            console.log("Erro cart shopify", error);

            reject(error);
        }
    });
}

function getDadosProduto(id_produto, variante_cart) {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM produtos WHERE id_produto_json=$1', [id_produto], (error, resultsProd) => {
                if (error) {
                    throw error
                }
                if (resultsProd.rows) {
                    resultsProd.rows.forEach((prod, ii) => {
                        const ProdutoJSON = JSON.parse(prod.json_dados_produto);
                        ProdutoJSON.variants.forEach((variante, i) => {
                            if (variante.id == variante_cart) {
                                var produto = {
                                    id_thuor: prod.id_thuor,
                                    variante_id: variante.id
                                }
                                resolve(produto);
                            }
                        });

                    });
                }
            });
        }
        catch (error) {
            console.log("Erro cart shopify", error);
            reject(error);
        }
    });
}
function getURLProduto(id_produto, quantity, variante_cart, i) {
    return new Promise((resolve, reject) => {
        try {
            var produtoFinal = "";
            produtoFinal = produtoFinal + produto.replace("@", i).replace("#", id_produto);
            produtoFinal = produtoFinal + quantidade.replace("@", i).replace("#", quantity);
            produtoFinal = produtoFinal + produto_variante.replace("@", i).replace("#", variante_cart);
            resolve(produtoFinal);
        }
        catch (error) {
            console.log("Erro cart shopify", error);
            reject(error);
        }
    });
}

function getDadosAdicionaisUrlProduto(token, isShopify, clearCart, qtdItems, store) {
    return new Promise((resolve, reject) => {
        try {
            var produtoFinal = "";
            produtoFinal = produtoFinal + format("cart_token={}&", token);
            produtoFinal = produtoFinal + format("isShopify={}&", isShopify);
            produtoFinal = produtoFinal + format("limpa_carrinho={}&", clearCart);
            produtoFinal = produtoFinal + format("qtd_items={}&", qtdItems);
            produtoFinal = produtoFinal + format("store={}&", store);

            resolve(produtoFinal);
        }
        catch (error) {
            console.log("Erro cart shopify", error);
            reject(error);
        }
    });
}

module.exports.CartShopify = async (req, res, next) => {
    var status, url_loja, token, isShopify, clearCart, skipToCheckout;
    var produto_option_id = [], produto_option_quantity = [], produto_option_variante_id = [];
    const { shop, cart } = req.body;
    token = "shopify-" + cart.token;
    var promises = [];
    cart.items.forEach((obj, i) => {
        promises.push(
            new DeferredPromise()
        )
    })
    var redirTo = ['cart', 'checkout'];
    var RetornoShopify = null;
    var produtoFinal = constantes.WEBSITECHECKOUT;
    const dadosLoja = await getDadosLoja(shop);
    status = dadosLoja.status;
    url_loja = dadosLoja.url_loja;
    skipToCheckout = dadosLoja.pula_carrinho;
    clearCart = dadosLoja.limpa_carrinho;
    isShopify = 1;

    produtoFinal = produtoFinal + await getDadosAdicionaisUrlProduto(token, isShopify, clearCart, cart.items.length, url_loja);
    cart.items.forEach(async (Item, i) => {
        const cartItem = Item;
        var produto_id = Item.product_id;
        var ProdutoVariante;
        const produto = await getDadosProduto(produto_id, cartItem.id);
        ProdutoVariante = produto.variante_id;
        produtoFinal = produtoFinal + await getURLProduto(produto.id_thuor, cartItem.quantity, ProdutoVariante, i);
        promises[i].resolve();
    });
    Promise.all(promises)
        .then(() => {
            var urlCart = produtoFinal = produtoFinal + format("redirectTo={}&", redirTo[0]);
            var urlCheckout = produtoFinal = produtoFinal.replace('redirectTo=cart', 'redirectTo=checkout');
            urlCart = urlCart.substr(0, urlCart.length - 1);
            urlCheckout = urlCheckout.substr(0, urlCheckout.length - 1);
            //console.log("Prod", produtoFinal);
            RetornoShopify = {
                "url": urlCart,
                "urlCheckout": urlCheckout,
                "active": status,
                "skip_cart": skipToCheckout
            }
            //console.log("ProdutoFinal", RetornoShopify);
            res.json(RetornoShopify);
            res.end();
        })
        .catch((error) => {
            console.log("Error", error);
        })

}



module.exports.CartShopifyClone = async (req, res, next) => {
    // return new Promise((resolve, reject) => {
    try {

        const { shop, cart } = req.body;
        var status, url_loja, token, isShopify, clearCart, skipToCheckout;
        var produto_option_id = [], produto_option_quantity = [], produto_option_variante_id = [];
        var redirTo = ['cart', 'checkout'];
        var RetornoShopify = null;
        var produtoFinal = constantes.WEBSITECHECKOUT;
        var promises = [];
        //console.log("Shop", promises);
        cart.items.forEach((obj, i) => {
            promises.push(
                new DeferredPromise()
            )
        })
        pool.query('SELECT * FROM integracoes_plataformas WHERE url_loja=$1', [shop], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows) {
                results.rows.forEach((obj, i) => {
                    status = obj.status;
                    url_loja = obj.url_loja;
                    skipToCheckout = obj.pula_carrinho;
                    clearCart = obj.limpa_carrinho;
                    isShopify = 1;

                })
                token = "shopify-" + cart.token;
                const produto = "produto_option_id[@]=#&";
                const quantidade = "produto_option_quantity[@]=#&";
                const produto_variante = "produto_option_variante_id[@]=#&";


                cart.items.forEach((Item, iii) => {
                    //console.log(iii);
                    const cartItem = Item;
                    var produto_id = Item.product_id;
                    var ProdutoVariante;

                    pool.query('SELECT * FROM produtos WHERE id_produto_json=$1', [produto_id], (error, resultsProd) => {
                        if (error) {
                            throw error
                        }
                        if (resultsProd.rows) {
                            resultsProd.rows.forEach((prod, ii) => {
                                //console.log("Produto Encontrado", prod.id_thuor);
                                const ProdutoJSON = JSON.parse(prod.json_dados_produto);
                                ProdutoJSON.variants.forEach((variante, i) => {
                                    //console.log("Variante", variante.id);
                                    if (variante.id == cartItem.id) {
                                        ProdutoVariante = variante;
                                        //console.log("ProdutoID", ProdutoVariante.product_id);
                                        //console.log("VarianteID", ProdutoVariante.id);
                                        produtoFinal = produtoFinal + produto.replace("@", i).replace("#", prod.id_thuor);
                                        produtoFinal = produtoFinal + quantidade.replace("@", i).replace("#", cart.items[i].quantity);
                                        produtoFinal = produtoFinal + produto_variante.replace("@", i).replace("#", ProdutoVariante.id);

                                    }
                                });
                                console.log("Produto", ii);
                                promises[0].resolve();
                                //promises[1].resolve();
                            });

                            //COMEÇA A PEGAR DADOS DO JSON RECEBIDO
                            produtoFinal = produtoFinal + format("cart_token={}&", token);
                            produtoFinal = produtoFinal + format("isShopify={}&", isShopify);
                            produtoFinal = produtoFinal + format("limpa_carrinho={}&", clearCart);
                            //console.log("Prod",produtoFinal);
                        }
                        else {
                            res.json({ mensagem: 'recebidoow' });
                            res.end();
                        }

                    });

                });

                //promises[0].resolve();
                //promises[1].resolve();


            }
            else {
                res.json({ mensagem: 'Loja Não encontrada' });
                res.end();
            }
            //console.log("ProdutoFinal", RetornoShopify);
            //res.json(RetornoShopify);
            //res.end();


        });

        Promise.all(promises)
            .then(() => {
                var urlCart = produtoFinal = produtoFinal + format("redirectTo={}&", redirTo[0]);
                var urlCheckout = produtoFinal = produtoFinal.replace('redirectTo=cart', 'redirectTo=checkout');
                urlCart = urlCart.substr(0, urlCart.length - 1);
                urlCheckout = urlCheckout.substr(0, urlCheckout.length - 1);
                //console.log("Prod", produtoFinal);
                RetornoShopify = {
                    "url": urlCart,
                    "urlCheckout": urlCheckout,
                    "active": status,
                    "skip_cart": skipToCheckout
                }
                console.log("ProdutoFinal", RetornoShopify);
                res.json(RetornoShopify);
                res.end();
            })
            .catch((error) => {
                console.log("Error", error);
            })

    } catch (error) {
        res.json("recebidoei");
        res.end();
    }
    // });
}

module.exports.GetIntegracaoPlataformaByID = (req, res, next) => {
    try {
        const { plataforma, id_usuario } = req.body;
        pool.query('SELECT * FROM integracoes_plataformas where id_usuario = $1 and plataforma = $2', [id_usuario, plataforma], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetIntegracaoPlataforma = (req, res, next) => {
    try {
        const { shop } = req.body;
        pool.query('SELECT * FROM integracao_plataformas', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateStatus = (req, res, next) => {
    try {
        const { id_usuario, plataforma, status, id } = req.body;
        console.log(req.body);

        pool.query('UPDATE integracoes_plataformas SET status=$3 where id_usuario = $1 and plataforma=$2 and id=$4', [id_usuario, plataforma, status, id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })


    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.AutoSinc = (req, res, next) => {
    try {
        const { id_usuario, plataforma, auto_sincroniza } = req.body;
        console.log(req.body);

        pool.query('UPDATE integracoes_plataformas SET auto_sincroniza=$3 where id_usuario = $1 and plataforma=$2 and id=$4', [id_usuario, plataforma, auto_sincroniza, id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })

    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.PulaCarrinho = (req, res, next) => {
    try {
        const { id_usuario, plataforma, pula_carrinho } = req.body;
        console.log(req.body);

        pool.query('UPDATE integracoes_plataformas SET pula_carrinho=$3 where id_usuario = $1 and plataforma=$2 and id=$4', [id_usuario, plataforma, pula_carrinho, id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })

    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.LimpaCarrinho = (req, res, next) => {
    try {
        const { id_usuario, plataforma, limpa_carrinho } = req.body;
        console.log(req.body);

        pool.query('UPDATE integracoes_plataformas SET limpa_carrinho=$3 where id_usuario = $1 and plataforma=$2 and id=$4', [id_usuario, plataforma, limpa_carrinho, id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows[0]);
            res.end();
        })

    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.WebHookShopify = async (req, res, next) => {
    try {
        //const { id_usuario, plataforma, limpa_carrinho } = req.body;
        var HTopic = req.headers['x-shopify-topic'];
        var HSha256 = req.headers['x-shopify-hmac-sha256'];
        var HShop = req.headers['x-shopify-shop-domain'];
        var HVersion = req.headers['x-shopify-api-version'];
        //////console.log(HTopic, HShop);
        getDadosLoja(HShop)
            .then((LDadosLoja) => {
                const LBody = req.body;
                if (HTopic == 'products/create') {
                    req.body.id_produto_json = LBody.id;
                    req.body.json_dados_produto = LBody;
                    req.body.titulo_produto = LBody.title;
                    req.body.id_usuario = LDadosLoja.id_usuario;
                    produtos.AddProduto(req, res, next);

                }
                if (HTopic == 'products/update') {
                    req.body.id_produto_json = LBody.id;
                    req.body.json_dados_produto = LBody;
                    req.body.titulo_produto = LBody.title;
                    req.body.id_usuario = LDadosLoja.id_usuario;
                    produtos.UpdateProduto(req, res, next);

                }
                if (HTopic == 'orders/create' || HTopic == 'orders/update') {
                    console.log("Orders", HTopic);
                    LBody.orders.forEach((obj, i) => {
                        req.body.email = obj.email;
                        req.body.telefone = obj.phone;
                        obj.fulfillments.forEach((objF, i) => {
                            req.body.order_id = obj.id;
                            req.body.fulfillment_id = objF.id;
                            req.body.json_shopify_order = objF;
                            req.body.data = objF.created_at;
                            req.body.updated = objF.updated_at;
                            req.body.status = 0;
                            //console.log(req.body.order_id, req.body.fulfillment_id, req.body.json_shopify_order);
                            //////fulfillments.SaveFulFillment(req, res, next);
                            transacoes.UpdateTransacaoShopifyOrder(req, res, next);
                        })

                    })
                }
                res.status(200).send('Ok!');
                res.end();
            })
            .catch((error) => {
                console.log("Erro ao pegar dados da Loja", error);
                res.status(500).send('Erro ao receber dados do webhook ' + error);
                res.end();
            })


        // pool.query('UPDATE integracoes_plataformas SET limpa_carrinho=$3 where id_usuario = $1 and plataforma=$2 and id=$4', [id_usuario, plataforma, limpa_carrinho, id], (error, results) => {
        //     if (error) {
        //         throw error
        //     }
        //     res.status(200).send(results.rows[0]);
        //     res.end();
        // })



    } catch (error) {
        res.json(error);
        res.end();
    }
}

