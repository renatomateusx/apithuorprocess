var pool = require('../db/queries');

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
module.exports.GetProdutoExists2 = async function(req, res, next) {

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
            const { id_produto_json, json_dados_produto, titulo_produto } = req.body

            pool.query('INSERT INTO produtos (id_produto_json, json_dados_produto, titulo_produto) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE id_produto_json = $1);', [id_produto_json, json_dados_produto, titulo_produto], (error, results) => {
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
module.exports.UpdateStatusProduto= (req, res, next) =>{
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

module.exports.UpdateTipoProduto= (req, res, next)=>{
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

module.exports.UpdateCustomFreteProduto= (req, res, next)=>{
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
module.exports.UpdateTipoFreteProduto= (req, res, next)=>{
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

module.exports.UpdateURLDirProduto= (req, res, next)=>{
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