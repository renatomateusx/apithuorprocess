var pool = require('../db/queries');
var jwt = require('jsonwebtoken');

module.exports.GetUserByID = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const { id } = req.body;
            pool.query('SELECT * FROM usuarios WHERE id = $1', [id], (error, results) => {
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

module.exports.GetUsers = (req, res, next) => {
    try {
        pool.query('SELECT * FROM usuarios', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows);

        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.SolicitarProposta = (req, res, next) => {
    try {
        const { nome, email, senha } = req.body

        pool.query('INSERT INTO proposta (nome, email, telefone, faturamento, mensagem, objetivo) VALUES ($1, $2, $3,$4,$5,$6)', [nome, email, telefone, faturamento, mensagem, objetivo], (error, results) => {
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

module.exports.GetUserByProfile = (req, res, next) => {
    try {
        const email = parseInt(req.params.email)

        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.GetUserByEmail = (req, res, next) => {
    try {
        const email = parseInt(req.params.email)

        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.EfetuaLogin = (req, res, next) => {
    try {
        if (req.body !== undefined) {
            const { email, senha } = req.body
           
            pool.query('SELECT * FROM usuarios WHERE email = $1 and senha = $2', [email, senha], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rows[0]) {
                    const id = results.rows[0].id;
                   
                    var token = jwt.sign({ id }, process.env.SECRET, {
                        expiresIn: '4h',
                    });
                    let LRetornoLogin = {
                        user: results.rows[0],
                        auth: token.length > 0,
                        token: token,
                    };
                    //console.log("Enviando", LRetornoLogin);
                    res.status(200).json(LRetornoLogin);

                } else {
                    res.status(401).json({mensagem: 'Login e a Senha inválidos!'});
                }

            })
        } else {
            res.status(500).send('Informe o Login e a Senha!');
        }
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.AddUser = (req, res, next) => {
    try {
        const { nome, email, senha } = req.body

        pool.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, senha], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`Usuário Criado: ${result.insertId}`)
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}