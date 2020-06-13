var pool = require('../../db/queries');

var constantes = require('../../resources/constantes');
const format = require('string-format');

module.exports.GetCampanhas = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {            
            pool.query('SELECT * FROM integracao_campanhas', (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send(results.rows);
                res.end();
            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.SaveCampanhaCartAbandon = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {            
            const {id_usuario, campanha, status} = req.body;
            pool.query('INSERT INTO campanhas (id_usuario, campanha, sequencia, status) VALUES($1, $2, $3, $4) ON CONFLICT (id_usuario, campanha) DO UPDATE SET id_usuario = $1, campanha=$2, sequencia = $3, status=$4',[id_usuario, campanha, req.body, +status], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send(results.rows);
                res.end();
            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.GetCampanhaByID = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_usuario, id } = req.body;
    
            pool.query('SELECT * FROM campanhas where id_usuario = $1 and campanha=$2', [id_usuario, id], (error, results) => {
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
    });
}

module.exports.GetCampanhaCarrinhoAbandonado = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id_usuario, campanha } = req.body;
    
            pool.query('SELECT * FROM campanhas where id_usuario = $1 and campanha=$2', [id_usuario, campanha], (error, results) => {
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
    });
}

module.exports.GetCampanhaByIDInternal = (id_usuario, id) => {
    return new Promise((resolve, reject) => {
        try {    
            pool.query('SELECT * FROM campanhas where id_usuario = $1 and campanha=$2', [id_usuario, id], (error, results) => {
                if (error) {
                    throw error
                }
                resolve(results.rows[0]);
            })
        } catch (error) {
            reject(error);
        }
    });
}