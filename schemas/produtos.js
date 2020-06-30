var pool = require('../db/queries');
const LNoImage = 'https://app.thuor.com/img/no-image.png';
module.exports.GetProdutos = (req, res, next) => {
    try {
        const { id_usuario } = req.body;
        pool.query('SELECT * FROM produtos where id_usuario = $1', [id_usuario], (error, results) => {
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

module.exports.GetProdutoByID = (req, res, next) => {
    try {
        const { id_produto } = req.body;

        pool.query('SELECT * FROM produtos WHERE id_produto_json = $1', [id_produto], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows[0])
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetProdutoByIDThuorUnique = (req, res, next) => {
    try {
        const { id_produto } = req.body;

        pool.query('SELECT * FROM produtos WHERE id_thuor = $1', [id_produto], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows[0])
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

function GetImageVariantID(variant, images) {
    return new Promise((resolve, reject) => {
        try {
            var imgSRC = LNoImage;
            if(images.length > 0){
                imgSRC = images[0].src;
            }           
            for (let img of images) {
                if (img.variant_ids.length > 0) {
                    //var imgs = img.variant_ids.indexOf(variant);
                    const imgs = img.variant_ids.find(x => x == variant);
                    //console.log("Has Image", imgs);
                    if (imgs != undefined) {
                        //console.log("Image", imgs);
                        imgSRC = img.src;
                        break;
                    }
                }
            }            
            resolve(imgSRC);
        }
        catch (error) {
            reject(error);
        }
    });
}


module.exports.GetProdutoByIDThuor = async (req, res, next) => {
    try {
        const { id_produto, quantity, variant } = req.body;
        console.log(id_produto, quantity, variant)
        pool.query('SELECT * FROM produtos WHERE id_thuor = $1', [id_produto], (error, resultsProd) => {
            if (error) {
                throw error
            }
            if (resultsProd.rows) {

                resultsProd.rows.forEach(async (prod, ii) => {
                    const ProdutoJSON = prod.json_dados_produto;
                    const plataforma = prod.plataforma;
                    const imgSRC = await GetImageVariantID(variant, ProdutoJSON.images);                    
                    ProdutoJSON.variants.forEach((variante, i) => {
                        if (variante.id == variant) {

                            var produto = {
                                title: ProdutoJSON.title,
                                variant_id: variante.id,
                                variant_title: variante.title,
                                quantity: quantity,
                                variant_price_ancora: variante.compare_at_price,
                                variant_price: variante.price,
                                variant_img: imgSRC,
                                id_thuor: prod.id_thuor,
                                plataforma: plataforma
                            }

                            res.status(200).json(produto);

                        }
                    });

                });
            }
            else {
                res.status(200).json({ mensagem: "Nenhum produto encontrado" });
            }
            //
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetProdutoByVariantIDInternal = (id_variant) => {
    return new Promise((resolve, reject) => {
        try {
            const LQuery = "select * FROM produtos WHERE json_dados_produto->'variants' @> \'[{\"id\":" + id_variant + "}]\' ";
            pool.query(LQuery, (error, resultsProd) => {
                if (error) {
                    throw error
                }
                if (resultsProd.rows) {
                    resolve(resultsProd.rows[0]);                    
                }
                else {
                    //res.status(200).json({ mensagem: "Nenhum produto encontrado" });
                    resolve(0);
                }
                //
            })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.GetProdutoByIDInternalShopify = (id_produto) => {
    return new Promise((resolve, reject) => {
        try {
            const LQuery = "select * FROM produtos WHERE json_dados_produto->'variants' @> \'[{\"id\":" + id_produto + "}]\' ";
            pool.query(LQuery, (error, resultsProd) => {
                if (error) {
                    throw error
                }
                if (resultsProd.rows) {

                    resultsProd.rows.forEach(async (prod, ii) => {
                        const ProdutoJSON = prod.json_dados_produto;
                        const imgSRC = await GetImageVariantID(id_produto, ProdutoJSON.images);
                        const plataforma = prod.plataforma;
                        ProdutoJSON.variants.forEach((variante, i) => {

                            if (variante.id == id_produto) {

                                var produto = {
                                    title: ProdutoJSON.title,
                                    variant_id: variante.id,
                                    variant_title: variante.title,                                  
                                    variant_price_ancora: variante.compare_at_price,
                                    variant_price: variante.price,
                                    variant_img: imgSRC,
                                    id_thuor: prod.id_thuor,
                                    plataforma: plataforma
                                }
                                resolve(produto);
                                //res.status(200).json(produto);

                            }
                        });

                    });
                }
                else {
                    //res.status(200).json({ mensagem: "Nenhum produto encontrado" });
                    resolve(0);
                }
                //
            })
        } catch (error) {
            reject(error);
        }
    })

}


module.exports.GetProdutoIDThuor = async (req, res, next) => {
    try {
        const { id_produto } = req.body;
        pool.query('SELECT * FROM produtos WHERE id_thuor = $1', [id_produto], (error, resultsProd) => {
            if (error) {
                throw error
            }
            res.status(200).json(resultsProd.rows[0]);

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetProdutoByIDThuorInternal = (id) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query('SELECT * FROM produtos WHERE id_thuor = $1', [id], (error, resultsProd) => {
                if (error) {
                    throw error
                }
                resolve(resultsProd.rows[0]);
            })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.GetProdutoByIDImported = async (req, res, next) => {
    try {
        const { id_produto, quantity, variant } = req.body;
        console.log(id_produto, quantity, variant)
        pool.query('SELECT * FROM produtos WHERE id_produto_json = $1', [id_produto], (error, resultsProd) => {
            if (error) {
                throw error
            }
            if (resultsProd.rows) {
                resultsProd.rows.forEach(async (prod, ii) => {
                    const ProdutoJSON = prod.json_dados_produto;
                    const imgSRC = await GetImageVariantID(variant, ProdutoJSON.images);
                    const plataforma = prod.plataforma;
                    ProdutoJSON.variants.forEach((variante, i) => {
                        if (variante.id == variant) {
                            var produto = {
                                title: ProdutoJSON.title,
                                variant_id: variante.id,
                                variant_title: variante.title,
                                quantity: quantity,
                                variant_price_ancora: variante.compare_at_price,
                                variant_price: variante.price,
                                variant_img: imgSRC,
                                id_thuor: prod.id_thuor,
                                id_usuario: prod.id_usuario,
                                plataforma: plataforma
                            }
                            res.status(200).json(produto);
                        }
                    });

                });
            }
            else {
                res.status(200).json({ mensagem: "Nenhum produto encontrado" });
            }

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetProdutoByIDImportedCheckoutIndependente = async (req, res, next) => {
    try {
        const { id_produto, quantity, variant } = req.body;
        //console.log(id_produto, quantity, variant)
        pool.query('SELECT * FROM produtos WHERE id_thuor = $1', [id_produto], (error, resultsProd) => {
            if (error) {
                throw error
            }
            if (resultsProd.rows) {
                resultsProd.rows.forEach(async (prod, ii) => {
                    const ProdutoJSON = prod.json_dados_produto;
                    const imgSRC = await GetImageVariantID(variant, ProdutoJSON.images);
                    const plataforma = prod.plataforma;
                    ProdutoJSON.variants.forEach((variante, i) => {
                        if (variante.id == variant) {
                            var produto = {
                                title: ProdutoJSON.title,
                                variant_id: variante.id,
                                variant_title: variante.title,
                                quantity: quantity,
                                variant_price_ancora: variante.compare_at_price,
                                variant_price: variante.price,
                                variant_img: imgSRC,
                                id_thuor: prod.id_thuor,
                                id_usuario: prod.id_usuario,
                                plataforma: plataforma
                            }
                            res.status(200).json(produto);
                        }
                    });

                });
            }
            else {
                res.status(200).json({ mensagem: "Nenhum produto encontrado" });
            }

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}


module.exports.GetProdutoExists = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_produto_json } = req.body;
            pool.query('SELECT * FROM produtos WHERE id_produto_json = $1', [id_produto_json], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rowCount);
            })

        } catch (error) {
            reject(error);
        }
    });
}
module.exports.GetProdutoExists2 = async function (req, res, next) {

    try {
        const { id_produto_json } = req.body;
        pool.query('SELECT * FROM produtos WHERE id_produto_json = $1', [id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            return results.rowCount;
        })

    } catch (error) {

    }

}

module.exports.AddProduto = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_produto_json, json_dados_produto, titulo_produto, id_usuario, plataforma } = req.body
            var status = '1';
            var tipo_produto = 'FISICO';
            var custom_frete = '0';


            pool.query('INSERT INTO produtos (id_produto_json, json_dados_produto, titulo_produto, id_usuario, status, tipo_produto, custom_frete, plataforma) VALUES( $1, $2, $3, $4, $5, $6, $7, $8 ) ON CONFLICT (id_produto_json) DO UPDATE SET id_produto_json =$1, json_dados_produto=$2', [id_produto_json, json_dados_produto, titulo_produto, id_usuario, status, tipo_produto, custom_frete, plataforma], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.insertId);
            })

        } catch (error) {
            reject(error);
        }
    });
}

module.exports.UpdateProduto = (req, res, next) => {
    try {
        const { id_produto_json, json_dados_produto, titulo_produto } = req.body;
        pool.query('UPDATE produtos SET json_dados_produto = $1, titulo_produto = $2 WHERE id_produto_json = $3', [json_dados_produto, titulo_produto, id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${results.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.DeleteProduto = (req, res, next) => {
    try {
        const { id_produto_json } = req.body

        pool.query('DELETE FROM produtos WHERE id_produto_json = $1', [id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${results}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}
module.exports.UpdateStatusProduto = (req, res, next) => {
    try {
        const { status, id_produto_json } = req.body

        pool.query('UPDATE produtos SET status = $1 WHERE id_produto_json = $2', [status, id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${results.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateTipoProduto = (req, res, next) => {
    try {
        const { tipo_produto, id_produto_json } = req.body
        pool.query('UPDATE produtos SET tipo_produto = $1 WHERE id_produto_json = $2', [tipo_produto, id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${results.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateCustomFreteProduto = (req, res, next) => {
    try {
        const { custom_frete, id_produto_json } = req.body
        pool.query('UPDATE produtos SET custom_frete = $1 WHERE id_produto_json = $2', [custom_frete, id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${results.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}
module.exports.UpdateTipoFreteProduto = (req, res, next) => {
    try {
        const { tipo_frete, preco_frete, id_produto_json } = req.body
        console.log("Dados", tipo_frete, preco_frete);
        pool.query('UPDATE produtos SET tipo_frete = $1, preco_frete = $2 WHERE id_produto_json = $3', [tipo_frete, preco_frete, id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${results.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.UpdateURLDirProduto = (req, res, next) => {
    try {
        const { url_dir_cartao, url_dir_boleto, id_produto_json } = req.body
        pool.query('UPDATE produtos SET url_dir_cartao = $1, url_dir_boleto = $2 WHERE id_produto_json = $3', [url_dir_cartao, url_dir_boleto, id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${results.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetPrazoEnvioVarianteByID = function (req, res, next) {

    try {
        const { id_variante, id_usuario, campo } = req.body;
        pool.query('SELECT * FROM variantes WHERE id_variante = $1 and id_usuario = $2', [id_variante, id_usuario], (error, results) => {
            if (error) {
                throw error
            }

            if (results.rows[0] !== undefined) {
                res.json({ campo: campo, prazo_envio: results.rows[0].prazo_envio });
                res.end();
            }
            else {
                res.json({ campo: campo, prazo_envio: 0 });
                res.end();
            }
        })

    } catch (error) {

    }

}

module.exports.SalvaPrazoEnvioVarianteByID = function (req, res, next) {

    try {
        const { id_variante, id_usuario, prazo_envio } = req.body;
        pool.query('INSERT INTO variantes (id_variante, id_usuario, prazo_postagem) VALUES ($1, $2, $3) ON CONFLICT (id_variante) DO UPDATE SET prazo_postagem = $3', [id_variante, id_usuario, prazo_envio], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Variante Atualizada: ${results.insertId}`)
        })

    } catch (error) {

    }

}

module.exports.SalvaGerenciamentoEstoqueVarianteByID = function (req, res, next) {

    try {
        const { id_variante, id_usuario, quantidade, quantidade_minima } = req.body;
        var gerencia_estoque = 1;
        var prazo_postagem = 0;
        console.log("Evento", id_variante);
        pool.query('INSERT INTO variantes (quantidade, quantidade_minima, gerencia_estoque, id_variante, id_usuario, prazo_postagem) VALUES($1, $2, $3, $4, $5,$6) ON CONFLICT (id_variante) DO UPDATE SET quantidade = $1, quantidade_minima = $2, gerencia_estoque = $3, prazo_postagem = $6', [quantidade, quantidade_minima, gerencia_estoque, id_variante, id_usuario, prazo_postagem], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Variante Atualizada: ${results.insertId}`)
        })

    } catch (error) {

    }

}

module.exports.DesativaGerenciamentoEstoquePorVarianteID = function (req, res, next) {

    try {
        const { id_variante, id_usuario } = req.body;
        pool.query("UPDATE variantes set gerencia_estoque = '0' WHERE id_variante = $1 and id_usuario = $2", [id_variante, id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Variante Atualizada: ${results.insertId}`)
        })

    } catch (error) {

    }

}

module.exports.GetDadosEstoquePorVarianteID = function (req, res, next) {
    try {
        const { id_variante, id_usuario } = req.body;
        pool.query("SELECT * FROM variantes WHERE id_variante = $1 and id_usuario = $2", [id_variante, id_usuario], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })

    } catch (error) {

    }

}