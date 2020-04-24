var pool = require('../db/queries');
var utils = require('../resources/util');
var constantes = require('../resources/constantes');
const format = require('string-format');
module.exports.GetIntegracaoShopifyCheckout = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_usuario } = req.body;
            pool.query('SELECT * FROM integracao_shopify WHERE id_usuario=$1', [id_usuario], (error, results) => {
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
            id_usuario } = req.body;
        pool.query('INSERT INTO integracao_shopify (status, auto_sincroniza, pula_carrinho, tipo_integracao, url_loja, chave_api_key, senha, segredo_compartilhado, quais_pedidos_enviar, id_usuario) VALUES ($1, $2, $3,$4,$5,$6, $7, $8, $9, $10)',
            [status,
                auto_sincroniza,
                pula_carrinho,
                tipo_integracao,
                url_loja,
                chave_api_key,
                senha,
                segredo_compartilhado,
                quais_pedidos_enviar,
                id_usuario],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).send(`Proposta Adicionada: ${result.insertId}`)
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
            quais_pedidos_enviar } = req.body;
        pool.query('UPDATE integracao_shopify SET status=$1, auto_sincroniza=$2, pula_carrinho=$3, tipo_integracao=$4, url_loja=$5, chave_api_key=$6, senha=$7, segredo_compartilhado=$8, quais_pedidos_enviar=$9) WHERE id=$10 and id_usuario = $11',
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
                id_usuario],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).send(`Proposta Adicionada: ${result.insertId}`)
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

module.exports.CartShopify = (req, res, next) => {
    // return new Promise((resolve, reject) => {
        try {
            const {shop, cart} = req.body;
            var status, url_loja, token, isShopify, clearCart, skipToCheckout;
            var produto_option_id=[], produto_option_quantity=[], produto_option_variante_id=[];
            var redirTo=['cart', 'checkout'];
            //console.log("Shop", shop);
            const { id_usuario } = req.body;
            pool.query('SELECT * FROM integracao_shopify WHERE url_loja=$1', [shop], (error, results) => {
                if (error) {
                    throw error
                }
                if(results.rows){
                    results.rows.forEach((obj,i)=>{
                        status = obj.status;
                        url_loja = obj.url_loja;          
                        skipToCheckout = obj.pula_carrinho;
                        clearCart = obj.limpa_carrinho;
                        isShopify = 1;
                                                             
                    })

                    //COMEÇA A PEGAR DADOS DO JSON RECEBIDO
                    token = "shopify-"+cart.token;
                    var produto = "produto_option_id[@]=#&";
                    var quantidade = "produto_option_quantity[@]=#&";
                    var produto_variante = "produto_option_variante_id[@]=#&";
                    var produtoFinal =constantes.WEBSITECHECKOUT;
                    
                    for(var i=0; i< cart.items.length; i++){
                        produtoFinal+= produto.replace("@",i).replace("#", cart.items[i].id);
                        produtoFinal+= quantidade.replace("@",i).replace("#", cart.items[i].quantity);
                        produtoFinal+= produto_variante.replace("@",i).replace("#", cart.items[i].variant_id);      
                                        
                    }
                    
                    produtoFinal+=format("cart_token={}&", token);                    
                    produtoFinal+=format("isShopify={}&", isShopify);
                    produtoFinal+=format("limpa_carrinho={}&", clearCart);

                    var urlCart = produtoFinal+= format("redirectTo={}&", redirTo[0]);
                    var urlCheckout = produtoFinal+= format("redirectTo={}&", redirTo[1]);
                    urlCart = urlCart.substr(0, urlCart.length-1);
                    urlCheckout = urlCheckout.substr(0, urlCheckout.length-1);


                    var RetornoShopify ={
                        "url": urlCart,
                        "urlCheckout": urlCheckout,
                        "active": status,
                        "skip_cart": skipToCheckout
                    }
                    console.log("ProdutoFinal", RetornoShopify);  
                    
                    


                }

            })
            res.json({mensagem: 'recebido'});
            res.end();
            // this.GetIntegracaoShopifyCheckout(req, res, next)
            //     .then((retorno) => {
            //         console.log("Retorno", retorno);
            //     })
            //     .catch((error) => {
            //         res.json(error);
            //         res.end();

            //     });
            // utils.makeAPICallExternalHTTPS()
            //     .then(retorno => {

            //     })
            //     .catch(error => {
            //         console.log("Erro ao tentar criar a API de Produtos para o tema.");
            //     })
        } catch (error) {
            res.json("recebido");
            res.end();
        }
    // });
}
