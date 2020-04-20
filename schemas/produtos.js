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
        const { id } = req.body;
        pool.query('SELECT * FROM produtos WHERE id_produto_json = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
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
        const { id_produto_json, json_dados_produto, titulo_produto } = request.body;
        pool.query('UPDATE produtos SET json_dados_produto = $1, titulo_produto = $2 WHERE id_produto_json = $3', [json_dados_produto, titulo_produto, id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${result.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.DeleteProduto = (req, res, next) => {
    try {
        const { id_produto_json } = request.body

        pool.query('DELETE FROM produtos WEHRE id_produto_json = $1', [id_produto_json], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`Produto Atualizado: ${result.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}